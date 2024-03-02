import { NextFunction, Request, Response } from "express";
import * as bcrypt from 'bcryptjs';
import { User } from "../entity/user";
import { TokenOperation } from "../utility/tokenOperations";
import { ROLES } from "../constants";
import { Address } from "../entity/address";
import dotenv from 'dotenv';
dotenv.config();

export class Auth {
    static async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, contact, password, addressLine1, addressLine2, pincode } = req.body || {};

            const userData: boolean = await User.createQueryBuilder()
                .select(['count(*)'])
                .where('email = :email OR contact = :contact', { email, contact })
                .getExists();

            if (userData) throw Error('email or contact already exists');

            const hashedPassword: string = await bcrypt.hash(password, 10);

            const address = await Address.save({
                addressLine1,
                addressLine2,
                pincode,
            });

            const data = await User.save({
                name,
                email,
                contact,
                password: hashedPassword,
                address,
            });

            const accessToken = new TokenOperation();

            res.status(201).json(
                {
                    data: {
                        name,
                        id: data.id
                    },
                    token: accessToken.signKey({
                        userId: data.id,
                        role: ROLES.CUSTOMER
                    })
                }
            );
        } catch (error) {
            next(error)
        }
    }

    static async signin(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body || {};
            const userData: User = await User.findOne(
                {
                    select: {
                        id: true,
                        name: true,
                        contact: true,
                        email: true,
                        password: true
                    },
                    where: {
                        email
                    }
                }
            );

            if (!userData) throw Error('Invalid Email or Password');
            if (!bcrypt.compareSync(password, userData.password)) throw Error('Invalid Email or Password');

            const accessToken = new TokenOperation();
            res.status(200).json(
                {
                    data: {
                        id: userData.id,
                        name: userData.name,
                        contact: userData.contact,
                        email: userData.email
                    },
                    token: accessToken.signKey({
                        userId: userData.id,
                        role: ROLES.CUSTOMER
                    })
                }
            );
        } catch (error) {
            next(error)
        }
    }

    static async signinAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body || {};

            //for this challenge one admin acount is there
            //email
            //password

            if (email != process.env.ADMIN_EMAIL && password != process.env.ADMIN_PASSWORD)
                throw Error('Invalid email or password!');


            const accessToken = new TokenOperation();
            res.status(200).json(
                {
                    data: {
                        email
                    },
                    token: accessToken.signKey({
                        userId: process.env.ADMIN_ID,
                        role: ROLES.ADMIN
                    })
                }
            );
        } catch (error) {
            next(error)
        }
    }
}