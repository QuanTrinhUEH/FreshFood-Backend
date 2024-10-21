class OrderHandler {
    async createOrder(req, res, next) {
        try {
            const { items, totalAmount } = req.body;
            const schema = Joi.object().keys({
                items: Joi.array()
                    .required()
                    .items(Joi.object().keys({
                        itemId: Joi.string()
                            .hex()
                            .length(24)
                            .required()
                            .messages({
                                "string.hex": "ID sản phẩm không hợp lệ",
                                "string.length": "ID sản phẩm không hợp lệ",
                                "any.required": "ID sản phẩm không được để trống"
                            }),
                        quantity: Joi.number()
                            .min(1)
                            .required()
                            .messages({
                                "number.min": "Số lượng phải lớn hơn 0",
                                "any.required": "Số lượng không được để trống"
                            })
                    }))
                    .messages({
                        "any.required": "Danh sách sản phẩm không được để trống"
                    }),
                totalAmount: Joi.number()
                    .required()
                    .messages({
                        "any.required": "Tổng tiền không được để trống"
                    })
            });
            await schema.validateAsync({
                items,
                totalAmount
            });
            next();
        } catch (e) {
            next(e);
        }
    }
    async updateOrderStatus(req, res, next) {
        try {
            const { status } = req.body;
            const schema = Joi.object().keys({
                status: Joi.string()
                    .valid("pending", "processing", "shipped", "delivered", "cancelled")
                    .required()
                    .messages({
                        "any.required": "Trạng thái không được để trống",
                        "any.only": "Trạng thái không hợp lệ"
                    })
            });
            await schema.validateAsync({ status });
            next();
        } catch (e) {
            next(e);
        }
    }
    async cancelOrder(req, res, next) {
        try {
            const id = req.params.id;
            const order = await orderModel.findOne({ _id: id });
            req.order = order;

            if (!order) {
                return res.status(400).json({
                    success: false,
                    message: "Đơn hàng không tồn tại",
                    status: 400,
                    data: null
                });
            }
            next();
        } catch (e) {
            next(e);
        }
    }
}

const orderMiddleware = new OrderHandler();
export default orderMiddleware;