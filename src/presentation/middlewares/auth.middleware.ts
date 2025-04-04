import { Request,Response, NextFunction } from "express";
import { JwtAdapter } from "../../config";
import { UserEntity } from "../../domain";
import { UserModel } from "../../data";


export class AuthMiddleware{
    static async validateJWT(req: Request, res: Response, next: NextFunction){

        const authorization = req.header('authorization');
        if (!authorization) return res.status(401).json({error: 'Not token provided'});
        if (!authorization.startsWith('Bearer ')) return res.status(401).json({error: 'Invalid Bearer token'});

        const token = authorization.split(' ').at(1) || '';

        try {
             const payload = await JwtAdapter.validateToken<{id:string}>(token);
             if (!payload) return res.status(401).json({error: 'invalid token'});

             const user = await UserModel.findById(payload.id);
             if (!user) return res.status(401).json({error: 'invalid token - user'});

             //Todo: validar si el usuario esta activo.

             req.body.user = UserEntity.fromObject(user);

             next();
        }catch ( error ){
            console.error( error );
            return res.status(500).json({error: 'Internal Server Error'});
        }

    }
}