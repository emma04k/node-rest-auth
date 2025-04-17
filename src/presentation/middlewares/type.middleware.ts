import { Request,Response, NextFunction } from "express";


export class TypeMiddleware {

    static validTypes(validTypes: string[]){
        return (req: Request, res: Response, next: NextFunction) => {
            const type = req.url.split('/').at(2) ?? '';
            console.log(req.params);
            if(!validTypes.includes(type)){
                return res.status(400).json({error:`Invalid type: ${type}, valid ones ${validTypes.join(', ')}`});
            }

            next();
        }
    }
}