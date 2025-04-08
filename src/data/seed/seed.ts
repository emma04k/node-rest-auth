import { envs } from "../../config";
import { CategoryModel, MongoDatabase, ProductModel, UserModel } from "../mongo";
import { seedData } from "./data";

(async () =>{
    await MongoDatabase.connect({
       dbName: envs.MONGO_DB_NAME,
       mongoUrl: envs.MONGO_URL,
    });

    await main();

    await MongoDatabase.disconnect();

})();

const randomNumber = (max: number) => {
    return Math.floor(Math.random()*max);
}

async function main(){
    //0. delete all!
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany(),
    ]);

    //1. create users
    const  users = await UserModel.insertMany(seedData.users);

    //2. create categories
    const categories = await CategoryModel.insertMany(
        seedData.categories.map( category => {
            return {
                ...category,
                user : users[randomNumber(users.length)]._id
            }
        })
    );

    //3. create products
    const products = await ProductModel.insertMany(
        seedData.products.map( product => {
            return {
                ...product,
                user: users[randomNumber(users.length)]._id,
                category: categories[randomNumber(categories.length)]._id
            }
        })
    )
    console.log('SEED');
}