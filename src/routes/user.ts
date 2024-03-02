import { Router } from 'express';
import { UserController } from '../controller/user';
import Validator from '../validator';

const router: Router = Router();

router.get('/', UserController.get);
export default router;