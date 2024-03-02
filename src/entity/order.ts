import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { OrderItems } from "./orderItems";
import { ORDER_STATUS } from "../constants";
import BaseEntityClass from "./baseEntityClass";

@Entity('order')
@Index('indx_user_order', ['user'])
export class Order extends BaseEntityClass {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    //use enum later
    @Column({ type: 'varchar', nullable: false, default: ORDER_STATUS.PENDING })
    status: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    amount: number;

    @ManyToOne(() => User, user => user.order)
    user: User;

    @OneToMany(() => OrderItems, orderItems => orderItems.order)
    orderItems: OrderItems[];
}