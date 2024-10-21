import express from 'express';
import orderController from '../controllers/order.controller.js';
import { authentication, authorization } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authentication, authorization("user"), orderController.createOrder);
router.patch('/:id/status', authentication, authorization("admin"), orderController.updateOrderStatus);
router.patch('/:id/cancel', authentication, authorization("user"), orderController.cancelOrder);

export default router;
