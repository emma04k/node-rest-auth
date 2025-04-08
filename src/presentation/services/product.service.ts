import { CreateProductDto, CustomError, PaginationDto, UserEntity } from "../../domain";
import { ProductModel } from "../../data";
import { populate } from "dotenv";

export class ProductService {
    //DI
    constructor() {}

    async create(createProductDto: CreateProductDto){

        const productExists = await ProductModel.findOne({name: createProductDto.name});
        if (productExists) throw CustomError.badRequest("Product already exists");
        try {

            const product = new ProductModel(createProductDto);

            await product.save();

            return product;

        }catch ( errors ){
            console.error( errors );
            throw CustomError.internalServer();
        }
    }

    async getProducts(pagination:PaginationDto){
        const {page, pageSize} = pagination;
        try {
            const [products,total] = await Promise.all([
                ProductModel.find()
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .populate('user', 'name')
                    .populate('category','name'),

                ProductModel.countDocuments(),
            ])
            return {
                page: page,
                pageSize: pageSize,
                total: total,
                next:`/api/products?page=${(page+1)}&pageSize=${(pageSize)}`,
                prev: (page > 1) ?`/api/products?page=${(page-1)}&pageSize=${(pageSize)}` : null,
                products:products
            };
        }catch ( error ){
            throw CustomError.internalServer();
        }
    }
}