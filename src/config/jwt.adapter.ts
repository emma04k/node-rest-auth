import jwt from 'jsonwebtoken';
import ms from 'ms';
import { envs } from "./envs";

const JWT_SEED = envs.JWT_SEED;
export class JwtAdapter{

    static async generateToke(payload:any, duration:string = '2h'){

        return new Promise((resolve)=>{
            jwt.sign(payload,JWT_SEED,{expiresIn : duration as ms.StringValue},(error, token) => {
                if(error) return resolve(null);

                resolve(token);
            });
        })
    }

    static async validateToken(token:string){
        return new Promise((resolve)=>{
            jwt.verify(token, JWT_SEED, (error, decoded) => {
                if(error) return resolve(null);
                resolve(decoded);
            })
        })
    }
}