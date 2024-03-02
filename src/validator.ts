import { body, param, query, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export default class Validator {
    static itemsGetParams = [
        query('page').notEmpty().isInt({ min: 1 }).toInt(),
        query('limit').notEmpty().isInt({ min: 1, max: 100 }).toInt(),
        query('search').optional(),

        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
    ];

    static itemGetParam = [
        param('id').notEmpty().isUUID(),
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
    ];

    static itemGetByCategoryParams = [
        param('categoryId').notEmpty().isUUID(),
        query('page').notEmpty().isInt({ min: 1 }).toInt(),
        query('limit').notEmpty().isInt({ min: 1, max: 100 }).toInt(),
        query('search').optional(),

        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
    ];

    static singup = [
        body('name').notEmpty().isString(),
        body('email').notEmpty().isEmail(),
        body('contact').notEmpty().isString().isLength({ min: 13 }),
        body('password').notEmpty().isStrongPassword(),
        body('addressLine1').notEmpty().isString(),
        body('addressLine2').optional().isString(),
        body('pincode').notEmpty().isString(),

        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
    ];

    static singin = [
        body('email').notEmpty().isEmail(),
        body('password').notEmpty().isString(),

        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
    ];

    static paymentWebhook = [
        body('orderId').notEmpty().isUUID(),

        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
    ];

    static createBulkItems = [
        body('categoryId').notEmpty().isUUID(),
        body('items').notEmpty().isArray({ min: 1 }),
        body('*.*.name').notEmpty().isString(),
        body('*.*.price').notEmpty().isDecimal(),
        body('*.*.unit').notEmpty().isString(),
        body('*.*.description').notEmpty().isString(),
        body('*.*.imageLink').notEmpty().isString(),
        body('*.*.stockQuantity').notEmpty().isInt(),

        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            console.log(errors);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
    ];

    static createCategory = [
        body('name').notEmpty().isString(),
        body('imageLink').notEmpty().isString(),

        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
    ];

    static editItem = [
        body('name').optional().isString(),
        body('price').optional().isDecimal(),
        body('description').optional().isString(),
        body('imageLink').optional().isString(),
        body('stockQuantity').optional().isInt(),
        body('categoryId').optional().isString(),
        param('id').notEmpty().isUUID(),

        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
    ]
}