import { orderModel } from "../models/order.model.js";

class OrderService {
    async createOrder(userId, items, totalAmount) {
        try {
            const newOrder = await orderModel.create({
                user: userId,
                items,
                totalAmount
            });
            return newOrder;
        } catch (e) {
            throw (
                {
                    message: e.message || e,
                    status: 500,
                    data: null
                }
            )
        }
    };
    async updateOrderStatus(id, status) {
        try {
            const updatedOrder = await orderModel.findByIdAndUpdate(id, { status }, { new: true });
            return updatedOrder;
        } catch (e) {
            throw (
                {
                    message: e.message || e,
                    status: 500,
                    data: null
                }
            )
        }
    }
    async cancelOrder(id) {
        try {
            const cancelledOrder = await orderModel.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
            return cancelledOrder;
        } catch (e) {
            throw (
                {
                    message: e.message || e,
                    status: 500,
                    data: null
                }
            )
        }
    }
}

const orderService = new OrderService();
export default orderService;