import Joi from "joi";
import { orderModel } from "../models/order.model.js";
class OrderHandler {
    async createOrder(req, res, next) {
        try {
            const { items, totalAmount, address, phoneNumber } = req.body;
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
                    }),
                address: Joi.string()
                    .required()
                    .messages({
                        "any.required": "Địa chỉ không được để trống"
                    }),
                phoneNumber: Joi.string()
                    .pattern(/^[0-9]{10}$/)
                    .required()
                    .messages({
                        "any.required": "Số điện thoại không được để trống",
                        "string.pattern.base": "Số điện thoại không hợp lệ"
                    })
            });
            await schema.validateAsync({
                items,
                totalAmount,
                address,
                phoneNumber
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
    async getOrders(req, res, next) {
        const schema = Joi.object({
            page: Joi.number()
                .integer()
                .min(1)
                .optional()
                .messages({
                    "number.base": "Số trang không hợp lệ",
                    "number.min": "Số trang phải lớn hơn 0"
                }),
            pageSize: Joi.number()
                .integer()
                .min(1)
                .optional()
                .messages({
                    "number.base": "Số lượng trên trang không hợp lệ",
                    "number.min": "Số lượng trên trang phải lớn hơn 0"
                }),
            search: Joi.string()
                .optional()
                .allow("")
                .messages({
                    "string.base": "Tìm kiếm không hợp lệ"
                })
        });

        try {
            const value = await schema.validateAsync(req.query);
            req.query = value;
            next();
        } catch (e) {
            next(e);
        }
    }
}

const orderMiddleware = new OrderHandler();
export default orderMiddleware;
