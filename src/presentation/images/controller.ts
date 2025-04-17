import {Request, Response} from 'express';
import fs from "fs";
import path from "path";

export class ImageController {

    constructor() {}

    getImage = (req:Request, res: Response)=>{

        const {type = '', name = ''} = req.params;

        const image = path.resolve(__dirname,`../../../uploads/${type}/${name}`);

        if(!fs.existsSync(image)){
           return  res.status(404).send('image not found');
        }
        return res.status(200).sendFile(image);
    }

}