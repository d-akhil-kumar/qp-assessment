import { Router } from 'express';
import { WebhookController } from '../controller/webhook';
import Validator from '../validator';

const router: Router = Router();

router.post('/payment/success', Validator.paymentWebhook, WebhookController.paymentSuccess);
router.post('/payment/fail', Validator.paymentWebhook, WebhookController.paymentFailed);

export default router;