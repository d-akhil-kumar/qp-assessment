import express, { Application, Request, Response } from 'express';
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


(async function () {
    try {
        app.listen(PORT, () => {
            console.log(`server is running on port: ${PORT}`)
        });
    } catch (error) {
        console.error("Error during Data Source initialization", error);
        process.exit(1);
    }
})();