import { Router } from 'express';
import { Auth } from '../controller/auth';
import Validator from '../validator';

const router: Router = Router();

router.post('/signup', Validator.singup, Auth.signup);
router.post('/signin', Validator.singin, Auth.signin);
router.post('/admin/signin', Validator.singin, Auth.signinAdmin);


export default router;