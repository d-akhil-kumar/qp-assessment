import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import logger from './utility/logger';
import { TokenOperation } from './utility/tokenOperations';
import { ROLES } from './constants';
import dotenv from 'dotenv';
dotenv.config();

export default class Middlewares {
    static errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
        logger.writeLogToFile(err.stack, './error.log');
        res.status(500).json({ error: err.message });
    }

    static requestLogger(req: Request, res: Response, next: NextFunction): void {
        logger.writeLogToFile(`${req.url}`, './request.log');
        next();
    }

    static verifyAuthCustomer(req: Request, res: Response, next: NextFunction): void {
        try {
            const tokenOperation = new TokenOperation();
            const istoken = req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer';
            if (!istoken) throw (Error('Required Token!'));

            const decodedAuth: any = tokenOperation.verifyKey(req.headers.authorization.split(' ')[1]);
            if (!decodedAuth) throw (Error('Invalid token!'));

            if (decodedAuth.role !== ROLES.CUSTOMER) throw (Error('Not Authorized!'));

            req['userId'] = decodedAuth.userId;
            next();
        } catch (error) {
            next(error);
        }
    }

    static verifyAuthAdmin(req: Request, res: Response, next: NextFunction): void {
        try {
            const tokenOperation = new TokenOperation();
            const istoken = req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer';
            if (!istoken) throw (Error('Required Token!'));

            const decodedAuth: any = tokenOperation.verifyKey(req.headers.authorization.split(' ')[1]);
            if (!decodedAuth) throw (Error('Invalid token!'));

            if (decodedAuth.role !== ROLES.ADMIN) throw (Error('Not Authorized!'));

            req['userId'] = decodedAuth.userId;
            next();
        } catch (error) {
            next(error);
        }
    }

    static verifyApiKey(req: Request, res: Response, next: NextFunction): void {
        try {
            const apiKey: string = req.headers['x-api-key'] as string;

            if (!apiKey) throw Error('API key missing');
            if (apiKey !== process.env.API_KEY) throw Error('Invalid API key');
            next();
        } catch (error) {
            next(error);
        }
    }
}