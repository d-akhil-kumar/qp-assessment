import express, { Application, NextFunction, Request, Response } from 'express';
import serverDataSource from './db/connection';
import itemRouter from './routes/item';
import authRouter from './routes/auth';
import cartRouter from './routes/cart';
import orderRouter from './routes/order';
import userRouter from './routes/user';
import webhookRouter from './routes/webhook';
import middlewares from './middleware';
import dotenv from 'dotenv';
dotenv.config();

const app: Application = express();
const PORT: number = +process.env.PORT || 3000;
const VERSION: string = process.env.VERSION || 'v1';
const PRE_ROUTE: string = `/${VERSION}/api`

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
    limit: '50kb',
}));


app.get('/ping', (req: Request, res: Response) => {
    res.send('pong');
});

app.use(middlewares.requestLogger);

app.use(`${PRE_ROUTE}/auth`, authRouter);
app.use(`${PRE_ROUTE}/items`, itemRouter);
app.use(`${PRE_ROUTE}/cart`, middlewares.verifyAuthCustomer, cartRouter);
app.use(`${PRE_ROUTE}/order`, middlewares.verifyAuthCustomer, orderRouter);
app.use(`${PRE_ROUTE}/user`, middlewares.verifyAuthCustomer, userRouter);
app.use(`${PRE_ROUTE}/webhook`, middlewares.verifyApiKey, webhookRouter);


app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const err: Error = new Error('404 Not Found!');
    next(err);
})
app.use(middlewares.errorHandler);


(async function () {
    try {
        await serverDataSource.initialize();
        app.listen(PORT, () => {
            console.log(`server is running on port: ${PORT}`)
        });
        console.log("Data Source has been initialized!");
    } catch (error) {
        console.error("Error during Data Source initialization", error);
        process.exit(1);
    }
})();