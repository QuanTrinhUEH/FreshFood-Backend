import orderService from '../service/order.service.js';

class OrderController {
    async createOrder(req, res, next) {
        try {
            const { items, totalAmount, address } = req.body;
            const userId = req.user._id;

            const newOrder = await orderService.createOrder(userId, items, totalAmount, address);

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

    async getOrders(req, res, next) {
        try {
            const { search = "", page = 1, pageSize = 10 } = req.query;

            const maxPageSize = 100;
            const limitedPageSize = Math.min(pageSize, maxPageSize);

            const filters = search
                ? { orderId: { $regex: search, $options: "i" } } : {};

            const { orders, totalOrdersCount } = await orderService.getOrders(filters, page, limitedPageSize);

            return res.status(200).json({
                success: true,
                message: "Lấy danh sách đơn hàng thành công",
                data: {
                    orders,
                    totalPages: Math.ceil(totalOrdersCount / limitedPageSize),
                    totalCount: totalOrdersCount,
                    currentPage: Number(page)
                },
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

    async getOrder(req, res, next) {
        try {
            const order = await orderService.getOrder(req.params.id);
            if (!order) {
                return res.status(404).json({
                    message: "Đơn hàng không tồn tại",
                    status: 404,
                    data: null
                });
            }
            res.status(200).json({
                message: "Lấy thông tin đơn hàng thành công",
                status: 200,
                data: { order }
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
