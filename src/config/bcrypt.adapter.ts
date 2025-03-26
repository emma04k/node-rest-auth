import { compareSync, genSaltSync, hashSync } from 'bcryptjs'

export class BcryptAdapter {
    constructor() {}

    static hash = (password: string) => {
        const salt = genSaltSync();
        return hashSync(password, salt);
    }

    static comparePassword = (password: string, passwordHashed: string) => {
        return compareSync(password, passwordHashed);
    }
}