import { Request, Response, NextFunction } from "express";
import { Cart } from "../entity/cart";
import { Item } from "../entity/item";

export class CartController {
    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const cartData: Cart[] = await Cart.createQueryBuilder('cart')
                .select([
                    'cart.id "cartId"',
                    'item.id "itemId"',
                    'cart.quantity "cartQuantity"',
                    `COALESCE(item."name", 'OUT_OF_STOCK') "name"`,
                    'item.price price',
                    'item.unit unit',
                    'item."imageLink" "imageLink"',
                    'cart.quantity*item.price "itemPrice"'
                ])
                .leftJoin('items', 'item', `item.id = cart."itemsId"
                    AND item."stockQuantity" > cart.quantity`)
                .where('cart."userId" = :userId', { userId: req['userId'] })
                .orderBy('cart."createdAt"', 'DESC')
                .execute();

            if (!cartData.length) throw Error('Cart is empty');

            return res.status(200).json(
                {
                    data: cartData
                }
            )
        } catch (error) {
            next(error);
        }
    }

    static async addorUpdate(req: Request, res: Response, next: NextFunction) {
        try {
            const { itemId, quantity } = req.body;

            let itemData: Item = await Item.findOneBy({ id: itemId });

            if (!itemData) throw Error('Invalid Item');
            if (itemData.stockQuantity < quantity) throw Error('Not Enough Stock!');

            const cart = new Cart();
            cart.items = itemId;
            cart.quantity = quantity;
            cart.user = req['userId'];

            await Cart.upsert(cart, ['user', 'items']);

            return res.status(201).json(
                {
                    msg: 'Item Added'
                }
            )
        } catch (error) {
            next(error);
        }
    }

    static async removeItem(req: Request, res: Response, next: NextFunction) {
        try {
            const { cartId } = req.body;
            await Cart.delete({ id: cartId });
            return res.status(200).json(
                {
                    msg: 'Item Removed'
                }
            )
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await Cart.delete({ user: { id: req['userId'] } });
            return res.status(200).json(
                {
                    msg: 'Cart Cleared'
                }
            )
        } catch (error) {
            next(error);
        }
    }
}