import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../domain";
import { CategoryModel } from "../../data";


export class CategoryService {
    //DI
    constructor() {}

    async create(createCategoryDto: CreateCategoryDto, user: UserEntity){

        const categoryExists = await CategoryModel.findOne({name: createCategoryDto.name});
        if (categoryExists) throw CustomError.badRequest("Category already exists");

        try {

            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id,
            });

            await category.save();

            return {
                id:category.id,
                name: category.name,
                available: category.available
            }

        }catch ( errors ){
            throw CustomError.internalServer();
        }
    }

    async getCategories(pagination:PaginationDto){

        const {page, pageSize} = pagination;

        try {
            const [categories,total] = await Promise.all([
                CategoryModel.find().skip((page - 1) * pageSize).limit(pageSize),
                CategoryModel.countDocuments()
            ])
            return {
                page: page,
                pageSize: pageSize,
                total: total,
                next:`/api/categories?page=${(page+1)}&pageSize=${(pageSize)}`,
                prev: (page > 1) ?`/api/categories?page=${(page-1)}&pageSize=${(pageSize)}` : null,
                categories:categories.map( x => ({
                    id: x.id,
                    name: x.name,
                    available: x.available
                }))
            };
        }catch ( error ){
            throw CustomError.internalServer();
        }
    }
}