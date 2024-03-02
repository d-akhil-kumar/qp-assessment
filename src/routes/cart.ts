import { Router } from 'express';

import Validator from '../validator';
import { CartController } from '../controller/cart';

const router: Router = Router();

//TODO add validation
router.get('/', CartController.get);
router.post('/', CartController.addorUpdate);
router.put('/', CartController.removeItem);
router.delete('/', CartController.delete);



export default router;