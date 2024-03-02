import { Entity, PrimaryGeneratedColumn, Column, OneToOne, BaseEntity, JoinColumn, OneToMany } from "typeorm";
import { Address } from "./address";
import { Cart } from "./cart";
import { Order } from "./order";

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150, nullable: false })
    name: string;

    @Column({ type: 'varchar', unique: true, length: 100, nullable: false })
    email: string;

    @Column({ type: 'varchar', unique: true, length: 16, nullable: false })
    contact: string;

    @Column({ type: 'varchar', unique: true, length: 150, nullable: false })
    password: string;

    @OneToOne(() => Address, address => address.user)
    @JoinColumn()
    address: Address;

    @OneToMany(() => Cart, cart => cart.user)
    cart: Cart[];

    @OneToMany(() => Order, order => order.user)
    order: Order[];
}