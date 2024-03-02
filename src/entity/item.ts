import { Column, Entity, Index, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import BaseEntityClass from "./baseEntityClass";
import { Category } from "./category";
import { Cart } from "./cart";
import { OrderItems } from "./orderItems";

@Entity('items')
@Index('indx_category_items', ['category'])
export class Item extends BaseEntityClass {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;

    @Column({ type: 'varchar', length: 10, nullable: false })
    unit: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'varchar', length: 500, nullable: false })
    imageLink: string;

    @Column({ type: 'int', default: 0, nullable: false })
    stockQuantity: number;
    
    @ManyToOne(() => Category, category  => category.items)
    category: Category

    @OneToMany(() => Cart, cart => cart.items)
    cart: Cart[];

    @OneToOne(() => OrderItems, orderItems => orderItems.item)
    orderItem: OrderItems
}