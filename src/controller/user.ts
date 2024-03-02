import { NextFunction, Request, Response } from "express";
import { User } from "../entity/user";
import { Address } from "../entity/address";

export class UserController {
    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const userData: User = await User.findOne({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    contact: true,
                    address: {
                        addressLine1: true,
                        addressLine2: true,
                        pincode: true,
                    }
                },
                relations: ['address'],
                where: { id: req['userId'] }
            });

            if (!userData) throw Error('User doesnt exists');
            res.status(200).json(
                {
                    data: userData
                }
            );
        } catch (error) {
            next(error)
        }
    }
}