import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./user";
import { Item } from "./item";
import BaseEntityClass from "./baseEntityClass";

@Entity('cart')
@Unique('uq_user_item', ['user', 'items'])
@Index('indx_user_cart', ['user'])
export class Cart extends BaseEntityClass{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.cart)
    user: User;

    @ManyToOne(() => Item, item => item.cart)
    items: Item;

    @Column({ type: 'int', nullable: false })
    quantity: number;
}