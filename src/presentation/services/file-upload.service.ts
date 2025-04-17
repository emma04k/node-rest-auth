import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from "fs";
import { CustomError } from "../../domain";
import { Uuid } from "../../config";


export class FileUploadService {
    constructor(
        private readonly uuid = Uuid.v4
    ) {
    }

    private checkFolder(folderPath: string) {
        if ((!fs.existsSync(folderPath))){
            fs.mkdirSync(folderPath);
        }
    }

    async uploadSingle(
        file: UploadedFile,
        folder: string = 'uploads',
        validateExtensions:string[] = ['png', 'jpg', 'jpeg', 'gif'],
    ){
        try {
            const fileExtension = file.mimetype.split('/').at(1) ?? "";
            const destination = path.resolve(__dirname,'../../../',folder)
            if(!validateExtensions.includes(fileExtension)){
                throw CustomError.badRequest(`Invalid extension: ${fileExtension}, valid ones ${validateExtensions}`);
            }
            this.checkFolder(destination)

            const fileName = `${this.uuid()}.${fileExtension}`;

            file.mv(`${destination}/${fileName}`);

            return {
                success: true,
                fileName: fileName,
            }

        }catch ( error ){
            throw error;
        }

    }

    async bulkUpload(
        files: UploadedFile[],
        folder: string = 'uploads',
        validateExtensions:string[] = ['png', 'jpg', 'jpeg', 'gif'],
    ){

        const fileNames = await Promise.all(
            files.map(file => this.uploadSingle(file, folder, validateExtensions))
        )

        return {
            success: true,
            fileNames: fileNames,
        }
    }

}