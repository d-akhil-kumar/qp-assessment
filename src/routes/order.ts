import { Router } from 'express';

import Validator from '../validator';
import { OrderController } from '../controller/order';

const router: Router = Router();

//TODO add validation
router.get('/process', OrderController.processOrder);
router.get('/:orderId', OrderController.getById);
router.get('/', Validator.itemsGetParams, OrderController.getAll);





export default router;