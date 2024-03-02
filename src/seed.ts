import serverDataSource from "./db/connection";
import { Item } from "./entity/item";
import { Category } from "./entity/category";
import { getRepository } from "typeorm";

const seedData = async () => {
    try {
        await serverDataSource.initialize();
        console.log("Data Source has been initialized!");

        //clear existing data
        await serverDataSource.query(`TRUNCATE TABLE "categories" RESTART IDENTITY CASCADE`);
        await serverDataSource.query(`TRUNCATE TABLE "items" RESTART IDENTITY CASCADE`);
        

        // Seed categories
        const categoryFreshProduce = new Category();
        categoryFreshProduce.name = 'Fresh Produce';
        categoryFreshProduce.imageLink = 'https://something.com/7312312.png',
        await categoryFreshProduce.save();

        const categoryDairyAndEggs = new Category();
        categoryDairyAndEggs.name = 'Dairy and Eggs';
        categoryDairyAndEggs.imageLink = 'https://something.com/8312312.png',
        await categoryDairyAndEggs.save();


        // Seed Items
        const productsFreshProduce = [
            {
                name: 'Apples',
                description: 'Fresh read apples direclty coming from Kashmir',
                unit: '800g',
                price: 400,
                imageLink: 'https://something.com/2312312.png',
                stockQuantity: 1000
            },
            {
                name: 'Bananas',
                description: 'High fibre bananas fresh in stock',
                unit: '250g',
                price: 200,
                imageLink: 'https://something.com/2312312.png',
                stockQuantity: 1000
            },
            {
                name: 'Carrots',
                description: 'Red juicy carrots good for eyes',
                unit: '500g',
                price: 300,
                imageLink: 'https://something.com/2312312.png',
                stockQuantity: 1000
            },
            {
                name: 'Tomatoes',
                description: 'Fresh read tomatoes direclty coming from Kashmir',
                unit: '800g',
                price: 200,
                imageLink: 'https://something.com/2312312.png',
                stockQuantity: 1000
            },
        ];

        const productsDairyAndEggs = [
            {
                name: 'Milk',
                description: 'Milk straight from farms',
                unit: '2Lt',
                price: 150,
                imageLink: 'https://something.com/2312312.png',
                stockQuantity: 1000
            },
            {
                name: 'Eggs',
                description: 'High protien straight from farms',
                unit: '6',
                price: 200,
                imageLink: 'https://something.com/2312312.png',
                stockQuantity: 1000
            },
            {
                name: 'Butter',
                description: 'Healthy butter for your paranthas',
                unit: '100g',
                price: 60,
                imageLink: 'https://something.com/2312312.png',
                stockQuantity: 1000
            },
            {
                name: 'Cheese',
                description: 'Perfect cheese for all your yummy snacks',
                unit: '200g',
                price: 120,
                imageLink: 'https://something.com/2312312.png',
                stockQuantity: 1000
            },
        ];

        const seedProducts = async (category: Category, items: any) => {
            for (const i of items) {
                const item = new Item();
                item.name = i.name;
                item.description = i.description;
                item.unit = i.unit;
                item.price = i.price;
                item.imageLink = i.imageLink;
                item.stockQuantity = i.stockQuantity;
                item.category = category;
                await item.save();
            }
        };

        await seedProducts(categoryFreshProduce, productsFreshProduce);
        await seedProducts(categoryDairyAndEggs, productsDairyAndEggs);



        console.log('Data Seeding Complete');

    } catch (error) {
        console.error("Error during Data Source initialization", error);
        process.exit(1);
    }
}

seedData();