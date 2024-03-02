import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order";
import { Item } from "./item";
import BaseEntityClass from "./baseEntityClass";

@Entity('orderItems')
@Index('indx_order_order_items', ['order'])
export class OrderItems extends BaseEntityClass {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;

    @Column({ type: 'int', nullable: false })
    quantity: number;

    @ManyToOne(() => Order, order => order.orderItems)
    order: Order;

    @OneToOne(() => Item, item => item.orderItem)
    @JoinColumn()
    item: Item;
}