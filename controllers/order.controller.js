import { orderModel } from '../models/order.model.js';
import orderService from '../service/order.service.js';

class OrderController {
    async createOrder(req, res, next) {
        try {
            const { items, totalAmount } = req.body;
            const userId = req.user._id;

            const newOrder = await orderService.createOrder(userId, items, totalAmount);

            res.status(201).json({
                message: 'Đơn hàng đã tạo thành công',
                status: 201,
                data: { order: newOrder }
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal server error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    }

    async updateOrderStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const updatedOrder = await orderService.updateOrderStatus(id, status);

            if (!updatedOrder) {
                return res.status(404).json({
                    message: 'Đơn hàng không tồn tại',
                    status: 404,
                    data: null
                });
            }

            res.status(200).json({
                message: 'Cập nhật trạng thái đơn hàng thành công',
                status: 200,
                data: { order: updatedOrder }
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal server error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    }

    async cancelOrder(req, res, next) {
        try {
            const { id } = req.params;

            const cancelledOrder = await orderService.cancelOrder(id);

            res.status(200).json({
                message: 'Hủy đơn hàng thành công',
                status: 200,
                data: { order: cancelledOrder }
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal server error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    }
}

export default new OrderController();
