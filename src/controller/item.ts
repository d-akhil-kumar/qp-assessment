import { Request, Response, NextFunction } from "express";
import { Item } from "../entity/item";
import { Category } from "../entity/category";
import { ILike } from "typeorm";
import { queryParams, createItem, editItem } from "../types";
import PaginationUtility from "../utility/pagination";


export class ItemController {
    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit, search }: queryParams = req.query || {};
            const whereConditions: { [key: string]: any } = {};

            if (search) {
                whereConditions.name = ILike(`%${search}%`);
            }

            const [data, totalCount]: [Item[], number] = await Item.findAndCount(
                {
                    select: {
                        id: true,
                        name: true,
                        imageLink: true,
                        price: true,
                        unit: true,
                        category: {
                            name: true,
                            id: true,
                        }
                    },
                    relations: ['category'],
                    where: whereConditions,
                    skip: (page - 1) * limit,
                    take: limit
                }
            );

            res.status(200).json(
                {
                    data,
                    ...PaginationUtility.createPagination(page, limit, totalCount)
                }
            );

        } catch (error) {
            next(error);
        }
    }

    static async getByid(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const data: Item = await Item.findOne(
                {
                    select: {
                        id: true,
                        name: true,
                        imageLink: true,
                        price: true,
                        unit: true,
                        description: true,
                        category: {
                            name: true,
                            id: true,
                        }
                    },
                    relations: ['category'],
                    where: {
                        id
                    }
                }
            );

            if (!data) {
                throw Error('No Data Found!');
            }

            res.status(200).json(
                {
                    data
                }
            );

        } catch (error) {
            next(error);
        }
    }

    static async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const data: Category[] = await Category.find(
                {
                    select: {
                        id: true,
                        name: true,
                        imageLink: true,
                    }
                }
            );

            if (!data) {
                throw Error('No Data Found!');
            }

            res.status(200).json(
                {
                    data
                }
            );

        } catch (error) {
            next(error);
        }
    }

    static async getItemsByCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { categoryId } = req.params;
            const { page, limit, search } = req.query as queryParams || {};

            const whereConditions: { [key: string]: any } = {
                category: { id: categoryId }
            };

            if (search) {
                whereConditions.name = ILike(`%${search}%`);
            }

            const [data, totalCount]: [Item[], number] = await Item.findAndCount(
                {
                    select: {
                        id: true,
                        name: true,
                        imageLink: true,
                        price: true,
                        unit: true,
                        category: {
                            name: true,
                            id: true,
                        }
                    },
                    relations: ['category'],
                    where: whereConditions,
                    skip: (page - 1) * limit,
                    take: limit
                }
            );

            res.status(200).json(
                {
                    data,
                    ...PaginationUtility.createPagination(page, limit, totalCount)
                }
            );

        } catch (error) {
            next(error);
        }
    }

    static async getAllDetailed(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit, search }: queryParams = req.query || {};
            const whereConditions: { [key: string]: any } = {};

            if (search) {
                whereConditions.name = ILike(`%${search}%`);
            }

            const [data, totalCount]: [Item[], number] = await Item.findAndCount(
                {
                    select: {
                        id: true,
                        name: true,
                        imageLink: true,
                        price: true,
                        unit: true,
                        stockQuantity: true,
                        createdAt: true,
                        updatedAt: true,
                        category: {
                            name: true,
                            id: true,
                        }
                    },
                    relations: ['category'],
                    where: whereConditions,
                    skip: (page - 1) * limit,
                    take: limit
                }
            );

            res.status(200).json(
                {
                    data,
                    ...PaginationUtility.createPagination(page, limit, totalCount)
                }
            );

        } catch (error) {
            next(error);
        }
    }

    static async getAllCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const data: Category[] = await Category.find();

            if (!data) {
                throw Error('No Data Found!');
            }

            res.status(200).json(
                {
                    data
                }
            );

        } catch (error) {
            next(error);
        }
    }

    static async getByIdDetailed(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const data: Item = await Item.findOne(
                {
                    select: {
                        id: true,
                        name: true,
                        imageLink: true,
                        price: true,
                        unit: true,
                        stockQuantity: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                        category: {
                            name: true,
                            id: true,
                        }
                    },
                    relations: ['category'],
                    where: {
                        id
                    }
                }
            );

            if (!data) {
                throw Error('No Data Found!');
            }

            res.status(200).json(
                {
                    data
                }
            );


        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            await Item.delete({ id });

            res.status(200).json(
                {
                    msg: 'Deleted item'
                }
            );

        } catch (error) {
            next(error);
        }
    }

    static async createBulkItems(req: Request, res: Response, next: NextFunction) {
        try {
            const { categoryId, items }: createItem = req.body;

            const categoryData: Category = await Category.findOneBy({ id: categoryId });

            if (!categoryData) throw Error('Invalid category');

            const itemsData: Item[] = [];

            items.forEach(d => {
                const item = new Item();
                item.name = d.name;
                item.price = d.price;
                item.unit = d.unit;
                item.description = d.description;
                item.stockQuantity = d.stockQuantity;
                item.imageLink = d.imageLink;
                item.category = categoryData;
                itemsData.push(item);
            });

            await Item.createQueryBuilder()
                .insert()
                .values(itemsData)
                .execute();

            res.status(200).json(
                {
                    msg: 'Data inserted successfully!'
                }
            );

        } catch (error) {
            next(error);
        }
    }

    static async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, imageLink } = req.body;
            const categoryData: Category = await Category.findOneBy({ name: ILike(name) });

            if (categoryData) throw Error('Category already exists');

            const category = new Category();
            category.name = name;
            category.imageLink = imageLink;

            const data = await category.save();

            res.status(200).json(
                {
                    data
                }
            );

        } catch (error) {
            next(error);
        }
    }

    static async editById(req: Request, res: Response, next: NextFunction) {
        try {
            const { categoryId, name, price, description, imageLink, stockQuantity }: editItem = req.body;
            const { id } = req.params;

            const data: Item = await Item.findOneBy({ id });
            if (!data) throw Error('No Data Found!');

            if (categoryId) {
                const category: Category = await Category.findOneBy({ id: categoryId });
                if (!category) throw Error('Invalid Category!');
                data.category = category;
            }

            if (name) data.name = name;
            if (price) data.price = price;
            if (description) data.description = description;
            if (imageLink) data.imageLink = imageLink;
            if (stockQuantity) data.stockQuantity += stockQuantity;

            const updatedData = await data.save();

            res.status(200).json(
                {
                    data: updatedData
                }
            );

        } catch (error) {
            next(error);
        }
    }
}