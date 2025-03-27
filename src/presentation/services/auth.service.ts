import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { UserModel } from "../../data";
import { BcryptAdapter, envs, JwtAdapter } from "../../config";
import { EmailService } from "./email.service";
import { emailTemplate } from "../../resources";


export class AuthService {
    constructor(
        private readonly emailService: EmailService,
    ) {}

    public async registerUser(dto:RegisterUserDto){

        const existUser = await UserModel.findOne({email : dto.email});
        if(existUser) throw CustomError.badRequest('Email already exists');

        try {
            const user = new UserModel(dto);
            // Encriptar el password
            user.password = BcryptAdapter.hash(dto.password);
            await user.save();

            //email de confirmación
            await this.sendEmailValidationLink(user.email,user.name);
            const {password, ...userEntity} = UserEntity.fromObject(user);

            //JWT <----- Para mantener la autenticación del usuario
            const token = await JwtAdapter.generateToke({id: user.id});
            if(!token) throw ('Error while generating JWT');

            return {
                user:userEntity,
                token: token
            };
        }catch ( error ){
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser(dto:LoginUserDto){

        const user = await UserModel.findOne({email : dto.email});
        if(!user) throw CustomError.badRequest('email or password incorrect');

        const isEqual = BcryptAdapter.comparePassword(dto.password,user.password);

        if(!isEqual) throw CustomError.badRequest('email or password incorrect');

        const {password, ...userEntity} = UserEntity.fromObject(user);

        const token = await JwtAdapter.generateToke({id: user.id});
        if(!token) throw CustomError.internalServer('Error while generating JWT');

        return {
            user:userEntity,
            token:token
        }
    }

    public async validateEmail(token:string){
        if(!token) throw CustomError.badRequest('token is required');
        const payload = await JwtAdapter.validateToken(token);
        if (!payload) throw CustomError.unauthorized('invalid Token');

        const {email} = payload as { email: string };
        if (!email) throw CustomError.internalServer('email not in token');

        const user  = await UserModel.findOne({email : email});

        if(!user) throw CustomError.internalServer('email not found');

        user.emailValidated = true;

        await user.save();

        return true;

    }

    private sendEmailValidationLink = async (email:string, name:string) =>{
        const token = await JwtAdapter.generateToke({email});
        if(!token) throw CustomError.internalServer('Error while generating JWT');

        const link = `${envs.WEB_SERVICE_URL}/auth/validate-email/${token}`;
        const htmlBody = emailTemplate.replace('[USER_NAME]',name).replace('[VALIDATION_LINK]', link);

        const options = {
            to:email,
            subject: 'Validate you email',
            htmlBody: htmlBody,
        }

        const isSent = await this.emailService.sendEmail(options);

        if (!isSent) throw CustomError.internalServer('Error while sending email');

        return true;

    }
}