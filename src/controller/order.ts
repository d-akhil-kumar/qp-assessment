import { Request, Response, NextFunction } from "express";
import { Cart } from "../entity/cart";
import { PaymentService } from "../service/paymentLink";
import { paymentLink, queryParams } from "../types";
import { Order } from "../entity/order";
import { OrderItems } from "../entity/orderItems";
import { Item } from "../entity/item";
import PaginationUtility from "../utility/pagination";

export class OrderController {
    static async processOrder(req: Request, res: Response, next: NextFunction) {
        try {
            //Todo make this one transaction using entityTransactionManager
            const cartData: Cart[] = await Cart.createQueryBuilder('cart')
                .select([
                    'cart.id "cartId"',
                    'item.id "itemId"',
                    'cart.quantity "cartQuantity"',
                    `item.name "name"`,
                    'item.price price',
                    'cart.quantity*item.price "itemPrice"'
                ])
                .innerJoin('items', 'item', `item.id = cart."itemsId"
                    AND item."stockQuantity" > cart.quantity`)
                .where('cart."userId" = :userId', { userId: req['userId'] })
                .getRawMany();

            if (!cartData.length) throw Error('Cart is empty');

            //step:1 get final price
            const totalPrice: number = cartData.reduce((acc: number, item: Cart) => {
                return acc + parseFloat(item['itemPrice']);
            }, 0);


            //step:2 create order
            const order: Order = new Order();
            order.user = req['userId'];
            order.amount = totalPrice;
            const orderData: Order = await order.save();


            //step:3 generate payment link
            const paymentService = new PaymentService();
            const paymentLink: paymentLink = paymentService.generatePaymentLink(totalPrice, orderData.id);


            //step:4 create order-items
            const orderItems: OrderItems[] = [];

            cartData.forEach(data => {
                const orderItem: OrderItems = new OrderItems();
                orderItem.name = data['name'];
                orderItem.price = data['price'];
                orderItem.quantity = data['cartQuantity'];
                orderItem.order = orderData;
                orderItem.item = data['itemId'];
                orderItems.push(orderItem);
            });

            await OrderItems
                .createQueryBuilder()
                .insert()
                .values(orderItems)
                .execute();


            //step:5 update items stock
            for (const item of cartData) {
                const itemId = item['itemId'];
                const quantity = item['cartQuantity'];

                await Item.createQueryBuilder()
                    .update()
                    .set({ stockQuantity: () => `stockQuantity - ${quantity}` })
                    .where(`id = :itemId`, { itemId })
                    .execute();
            }

            //step:6 clear cart
            await Cart.delete({ user: { id: req['userId'] } });

            return res.status(200).json(
                {
                    data: {
                        totalPrice,
                        order,
                        paymentLink,
                    }
                }
            )
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit }: queryParams = req.query || {};
            const [data, totalCount]: [Order[], number] = await Order.findAndCount({
                relations: ['orderItems'],
                where: {
                    user: { id: req['userId'] }
                },
                order: {
                    createdAt: 'DESC'
                },
                skip: (page - 1) * limit,
                take: limit
            });


            return res.status(200).json(
                {
                    data,
                    ...PaginationUtility.createPagination(page, limit, totalCount)
                }
            )
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.params || {};
            const data = await Order.findOne({
                relations: ['orderItems'],
                where: {
                    id: orderId
                }
            });

            return res.status(200).json(
                {
                    data
                }
            )
        } catch (error) {
            next(error);
        }
    }
}