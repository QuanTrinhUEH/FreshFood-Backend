import express from 'express';
import orderController from '../controllers/order.controller.js';
import { authentication, authorization } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authentication, authorization("user"), orderController.createOrder);
router.patch('/status/:id', authentication, authorization("admin"), orderController.updateOrderStatus);
router.patch('/cancel/:id', authentication, authorization("user"), orderController.cancelOrder);

export default router;
