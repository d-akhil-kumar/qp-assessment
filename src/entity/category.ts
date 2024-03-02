import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import BaseEntityClass from "./baseEntityClass";
import { Item } from "./item";

@Entity('categories')
export class Category extends BaseEntityClass{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', unique: true, nullable: false})
    name: string;

    @Column({type: 'varchar', length: 250, nullable: false})
    imageLink: string;

    @OneToMany(() => Item, item => item.category)
    items: Item[];
}