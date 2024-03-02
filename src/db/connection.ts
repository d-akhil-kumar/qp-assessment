import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Category } from '../entity/category';
import { Item } from '../entity/item';
import dotenv from 'dotenv';
import { User } from '../entity/user';
import { Address } from '../entity/address';
import { Cart } from '../entity/cart';
import { Order } from '../entity/order';
import { OrderItems } from '../entity/orderItems';
dotenv.config();

const connectionOption: PostgresConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT as string) || 5432,
    username: process.env.DB_USERNAME || 'local-postgres',
    password: process.env.DB_PASSWORD || 'local-postgres',
    database: process.env.DB_NAME || 'local-postgres',
    entities: [
        Category,
        Item,
        User,
        Address,
        Cart,
        Order,
        OrderItems,
    ],
    synchronize: true, // TODO: Not for production, will replace it with migrations (out of scope for now)
}

const serverDataSource = new DataSource(connectionOption);

export default serverDataSource;
