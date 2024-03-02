import { Router } from 'express';
import { ItemController } from '../controller/item';
import Validator from '../validator';
import Middlewares from '../middleware';

const router: Router = Router();


router.get('/', Validator.itemsGetParams, ItemController.get);
router.get('/categories', ItemController.getCategories);
router.get('/:categoryId/items', Validator.itemGetByCategoryParams, ItemController.getItemsByCategory);
router.get('/:id', Validator.itemGetParam, ItemController.getByid);

//admin routes
router.use(Middlewares.verifyAuthAdmin);
router.get('/admin/items/all', Validator.itemsGetParams, ItemController.getAllDetailed);
router.get('/admin/:id/item', ItemController.getByIdDetailed);
router.get('/admin/categories/all', ItemController.getAllCategories);
router.post('/admin/create-items', Validator.createBulkItems, ItemController.createBulkItems);
router.post('/admin/create-category', Validator.createCategory, ItemController.createCategory);
router.put('/admin/:id/item', Validator.editItem, ItemController.editById);
router.delete('/admin/:id/item', ItemController.delete);

export default router;