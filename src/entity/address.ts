import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import BaseEntityClass from "./baseEntityClass";
import { User } from "./user";


@Entity('address')
export class Address extends BaseEntityClass{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'text', nullable: false})
    addressLine1: string;

    @Column({type: 'varchar', length: 100, nullable: true})
    addressLine2: string;

    @Column({type: 'varchar', length: 10, nullable: false})
    pincode: string;
    
    @OneToOne(() => User, user => user.address)
    user: User;
}