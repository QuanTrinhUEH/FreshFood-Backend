import express from 'express';
import orderController from '../controllers/order.controller.js';
import { authentication, authorization } from '../middlewares/auth.middleware.js';
import orderMiddleware from '../middlewares/order.middleware.js';

const router = express.Router();

router.post('/', authentication, authorization("user"), orderMiddleware.createOrder, orderController.createOrder);
router.patch('/status/:id', authentication, authorization("admin"), orderMiddleware.updateOrderStatus, orderController.updateOrderStatus);
router.patch('/cancel/:id', authentication, authorization("user"), orderController.cancelOrder);
router.get('/', authentication, authorization("admin"), orderMiddleware.getOrders, orderController.getOrders);
router.get('/user/myOrders', authentication, authorization("user"), orderMiddleware.getUserOrders, orderController.getUserOrders);
router.get('/:id', authentication, authorization("admin"), orderController.getOrder);

export default router;
