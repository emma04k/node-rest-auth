import { Router } from 'express';
import { FileUploadController } from "./controller";
import { FileUploadService } from "../services";
import { FileUploadMiddleware } from "../middlewares";
import { TypeMiddleware } from "../middlewares/type.middleware";





export class FileUploadRoutes {


    static get routes(): Router {

        const router = Router();
        const fileUploadController = new FileUploadController(
            new FileUploadService(),
        );

        router.use(FileUploadMiddleware.containFiles);
        router.use(TypeMiddleware.validTypes(['users','categories','products']));
        //api/upload/single/<user|category|product>
        //api/upload/bulk/<user|category|product>
        router.post('/single/:type', fileUploadController.uploadFile);
        router.post('/bulk/:type', fileUploadController.bulkUploadFile );

        return router;
    }


}

