import { orderModel } from '../models/order.model.js';

class OrderController {
  async createOrder(req, res, next) {
    try {
      const { items, totalAmount } = req.body;
      const userId = req.user._id;

      const newOrder = await orderModel.create({
        user: userId,
        items,
        totalAmount
      });

      res.status(201).json({
        message: 'Order created successfully',
        status: 201,
        data: { order: newOrder }
      });
    } catch (e) {
      next(e);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedOrder = await orderModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({
          message: 'Order not found',
          status: 404,
          data: null
        });
      }

      res.status(200).json({
        message: 'Order status updated successfully',
        status: 200,
        data: { order: updatedOrder }
      });
    } catch (e) {
      next(e);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const { id } = req.params;

      const cancelledOrder = await orderModel.findByIdAndUpdate(
        id,
        { status: 'cancelled' },
        { new: true }
      );

      if (!cancelledOrder) {
        return res.status(404).json({
          message: 'Order not found',
          status: 404,
          data: null
        });
      }

      res.status(200).json({
        message: 'Order cancelled successfully',
        status: 200,
        data: { order: cancelledOrder }
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new OrderController();
