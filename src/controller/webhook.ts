import { Request, Response, NextFunction } from "express";
import { Order } from "../entity/order";
import { OrderItems } from "../entity/orderItems";
import { Item } from "../entity/item";
import { ORDER_STATUS } from "../constants";

export class WebhookController {
    static async paymentSuccess(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.body;
            const orderData = await Order.findOneBy({
                id: orderId
            });

            if (!orderData) throw Error('Order doesnt exists');
            if (orderData.status !== ORDER_STATUS.PENDING) throw Error('Invalid order');

            orderData.status = ORDER_STATUS.SUCCESS;
            await orderData.save();

            return res.status(201).json(
                {
                    msg: 'Order created'
                }
            );
        } catch (error) {
            next(error);
        }
    }

    static async paymentFailed(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.body;
            const orderData = await Order.findOneBy({
                id: orderId
            });

            if (!orderData) throw Error('Order doesnt exists');
            if (orderData.status !== ORDER_STATUS.PENDING) throw Error('Invalid order');

            orderData.status = ORDER_STATUS.FAILED;
            await orderData.save();

            const orderItemsData: OrderItems[] = await OrderItems.find(
                {
                    select: {
                        quantity: true,
                        item: {
                            id: true
                        }
                    },
                    relations: ['item'],
                    where: {
                        order: {
                            id: orderId
                        }
                    }
                }
            );


            //update items stock back
            for (const item of orderItemsData) {
                const itemId = item.item.id;
                const quantity = item.quantity;

                await Item.createQueryBuilder()
                    .update()
                    .set({ stockQuantity: () => `stockQuantity + ${quantity}` })
                    .where(`id = :itemId`, { itemId })
                    .execute();
            }

            return res.status(201).json(
                {
                    msg: 'Order failed'
                }
            )
        } catch (error) {
            next(error);
        }
    }
}