import { RegisterUserDto } from "../auth/register-user.dto";
import { CustomError } from "../../errors/custom.error";
import { CreateCategoryDto } from "../category/create-category.dto";
import { Validators } from "../../../config";


export class CreateProductDto {

    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly description: string,
        public readonly price: number,
        public readonly user:string,
        public readonly category:string,
    ) {
    }

    static create(obj:{[key:string]:any}):[string?,CreateProductDto?] {
        const {name, available, description,price, user, category} = obj;

        let availableBoolean = available;

        if (!name) return['Missing name'];
        availableBoolean = (available === 'true');
        if (!description) return['Missing description'];
        if (!price) return['Missing price'];
        if (isNaN(price)) return ['Price should be a number'];
        if (!user) return['Missing userId'];
        if (!Validators.isMongoId(user)) return ['userId is invalid'];
        if (!category) return['Missing categoryId'];
        if (!Validators.isMongoId(category)) return ['categoryId is invalid'];

        return [undefined,new CreateProductDto(name,availableBoolean,description,price, user, category)];
    }
}