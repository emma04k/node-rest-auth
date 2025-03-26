import { CustomError } from "../errors/custom.error";


export class UserEntity {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public emailValidate: boolean,
        public password: string,
        public role: string[],
        public img?: string,
    ) {}

    static fromObject(obj: { [key: string]: any }){
        const { id, _id, name, email, emailValidated, password, role, img } = obj;

        const errorMessage = 'Missing required';

        if(!_id && !id) throw CustomError.badRequest(`${errorMessage} id`);
        if(!name) throw CustomError.badRequest(`${errorMessage} name`);
        if(!email) throw CustomError.badRequest(`${errorMessage} email`);
        if(!emailValidated === undefined) throw CustomError.badRequest(`${errorMessage} emailValidate`);
        if(!password) throw CustomError.badRequest(`${errorMessage} password`);
        if (!role) throw CustomError.badRequest(`${errorMessage} role`);

        return new UserEntity(_id || id, name, email, emailValidated, password, role, img );
    }

}