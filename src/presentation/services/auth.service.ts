import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { UserModel } from "../../data";
import { BcryptAdapter, JwtAdapter } from "../../config";


export class AuthService {
    constructor() {}

    public async registerUser(dto:RegisterUserDto){

        const existUser = await UserModel.findOne({email : dto.email});
        if(existUser) throw CustomError.badRequest('Email already exists');

        try {
            const user = new UserModel(dto);
            // Encriptar el password
            user.password = BcryptAdapter.hash(dto.password);
            await user.save();
            //JWT <----- Para mantener la autenticación del usuario

            //email de confirmación

            const {password, ...userEntity} = UserEntity.fromObject(user);
            return {
                user:userEntity,
                token:'ABC'
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

        const token = await JwtAdapter.generateToke({id: user.id, email: user.email});
        if(!token) throw CustomError.internalServer('Error while generating JWT');


        return {
            user:userEntity,
            token:token
        }
    }
}