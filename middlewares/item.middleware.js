import Joi from "joi";
import { itemModel } from "../models/item.model.js";

class itemHandler {
    async createItem(req, res, next) {
        try {
            const { itemName, price, variants, description, images, foodType, promotion, quantity } = req.body
            const schema = Joi.object().keys({
                itemName: Joi.string()
                    .required()
                    .messages({
                        "any.required": "Tên sản phẩm không được để trống"
                    }),
                price: Joi.number()
                    .min(1000)
                    .max(1000000)
                    .required()
                    .messages({
                        "any.required": "Giá sản phẩm không được để trống",
                        "number.min": "Giá sản phẩm phải lớn hơn 1000",
                        "number.max": "Giá sản phẩm phải nhỏ hơn 1000000"
                    }),
                variants: Joi.string()
                    .min(1)
                    .required()
                    .messages({
                        "string.min": "Tên phân loại phải có ít nhất 1 kí tự",
                        "any.required": "Tên phân loại không được để trống"
                    }),
                description: Joi.string()
                    .required()
                    .messages({
                        "any.required": "Mô tả sản phẩm không được để trống"
                    }),
                images: Joi.array()
                    .items(Joi.string())
                    .required()
                    .messages({
                        "any.required": "Ảnh sản phẩm không được để trống"
                    }),
                foodType: Joi.string()
                    .required()
                    .valid('fruits', 'vegetables', 'meats', 'seafood')
                    .messages({
                        "any.required": "Loại sản phẩm không được để trống",
                        "any.only": "Loại sản phẩm không hợp lệ"
                    }),
                promotion: Joi.string()
                    .optional()
                    .hex()
                    .length(24)
                    .messages({
                        "string.hex": "ID khuyến mãi không hợp lệ",
                        "string.length": "ID khuyến mãi không hợp lệ"
                    }),
                quantity: Joi.number()
                    .integer()
                    .min(0)
                    .required()
                    .messages({
                        "any.required": "Số lượng sản phẩm không được để trống",
                        "number.base": "Số lượng sản phẩm phải là số nguyên",
                        "number.min": "Số lượng sản phẩm không thể âm"
                    })
            })
            await schema.validateAsync({
                itemName,
                price,
                variants,
                description,
                images,
                foodType,
                promotion,
                quantity
            });

            const existedItem = await itemModel.findOne({ itemName, status: 1 })
            if (existedItem) {
                return res.status(400).json({
                    success: false,
                    message: "Sản phẩm đã tồn tại",
                    status: 400,
                    data: null
                });
            }
            next()
        }
        catch (e) {
            next(e)
        }
    }
    async updateItem(req, res, next) {
        try {
            const { itemName, price, variants, description, images, foodType, status, promotion, quantity } = req.body
            const schema = Joi.object().keys({
                itemName: Joi.string(),
                price: Joi.number()
                    .min(1000)
                    .max(1000000)
                    .messages({
                        "number.min": "Giá sản phẩm phải lớn hơn 1000",
                        "number.max": "Giá sản phẩm phải nhỏ hơn 1000000"
                    }),
                variants: Joi.string()
                    .min(1)
                    .messages({
                        "string.min": "Tên phân loại phải có ít nhất 1 kí tự",
                    }),
                description: Joi.string(),
                images: Joi.array()
                    .items(Joi.string()),
                foodType: Joi.string()
                    .valid('fruits', 'vegetables', 'meats', 'seafood')
                    .messages({
                        "any.only": "Loại sản phẩm không hợp lệ"
                    }),
                status: Joi.number()
                    .valid(0, 1)
                    .optional()
                    .messages({
                        "any.only": "Trạng thái không hợp lệ"
                    }),
                promotion: Joi.string()
                    .optional()
                    .hex()
                    .length(24)
                    .messages({
                        "string.hex": "ID khuyến mãi không hợp lệ",
                        "string.length": "ID khuyến mãi không hợp lệ"
                    }),
                quantity: Joi.number()
                    .integer()
                    .min(1)
                    .messages({
                        "number.min": "Số lượng sản phẩm phải lớn hơn 0"
                    })
            })
            await schema.validateAsync({
                itemName,
                price,
                variants,
                description,
                images,
                foodType,
                status,
                promotion,
                quantity
            });

            const id = req.params.id;
            const item = await itemModel.findOne({ _id: id });
            req.item = item;

            if (!item) {
                return res.status(400).json({
                    success: false,
                    message: "Sản phẩm không tồn tại",
                    status: 400,
                    data: null
                });
            }

            const existedItem = await itemModel.findOne({ itemName: req.body.itemName, _id: { $ne: req.params.id } });
            if (existedItem) {
                return res.status(400).json({
                    success: false,
                    message: "Sản phẩm đã tồn tại",
                    status: 400,
                    data: null
                });
            }

            next()
        }
        catch (e) {
            next(e)
        }
    }
    async getItemsAdmin(req, res, next) {
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
                    "number.base": "Số trang không hợp lệ",
                    "number.min": "Số trang phải lớn hơn 0"
                }),
            search: Joi.string()
                .optional()
                .allow("")
                .messages({
                    "string.base": "Tìm kiếm không hợp lệ"
                }),
            status: Joi.number()
                .valid(0, 1)
                .optional()
                .messages({
                    "any.only": "Trạng thái không hợp lệ"
                }),
        });

        try {
            const value = await schema.validateAsync(req.query);
            req.query = value;
            next();
        } catch (error) {
            next(error);
        }
    };
    async getItems(req, res, next) {
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
                    "number.base": "Số trang không hợp lệ",
                    "number.min": "Số trang phải lớn hơn 0"
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
        } catch (error) {
            next(error);
        }
    };
    async validateFoodType(req, res, next) {
        const schema = Joi.object({
            foodType: Joi.string()
                .required()
                .valid('fruits', 'vegetables', 'meats', 'seafood')
                .messages({
                    "any.required": "Loại sản phẩm không được để trống",
                    "any.only": "Loại sản phẩm không hợp lệ"
                })
        });

        try {
            await schema.validateAsync(req.params);
            next();
        } catch (e) {
            next(e);
        }
    }
}

const itemMiddleware = new itemHandler();
export default itemMiddleware
