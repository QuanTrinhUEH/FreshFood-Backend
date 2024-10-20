import Joi from "joi";
import tokenService from "../service/token.service.js";
import fs from 'fs';
import { itemModel } from "../models/item.model.js";

const filePath = fs.realpathSync('./');

class itemHandler {
    async getItemsAdmin(req, res, next) {
        const schema = Joi.object({
            page: Joi.number()
                .integer()
                .min(1)
                .optional()
                .messages({
                    "number.base": "Invalid page",
                    "number.min": "Page must be greater than 0"
                }),
            pageSize: Joi.number()
                .integer()
                .min(1)
                .optional()
                .messages({
                    "number.base": "Invalid page size",
                    "number.min": "Page size must be greater than 0"
                }),
            search: Joi.string()
                .optional()
                .allow("")
                .messages({
                    "string.base": "Invalid search"
                }),
            status: Joi.number()
                .valid(0, 1)
                .optional()
                .messages({
                    "any.only": "Invalid status"
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
                    "number.base": "Invalid page",
                    "number.min": "Page must be greater than 0"
                }),
            pageSize: Joi.number()
                .integer()
                .min(1)
                .optional()
                .messages({
                    "number.base": "Invalid page size",
                    "number.min": "Page size must be greater than 0"
                }),
            search: Joi.string()
                .optional()
                .allow("")
                .messages({
                    "string.base": "Invalid search"
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
    async createItem(req, res, next) {
        const { itemName, price, discount, variants, description, food_type } = req.body
        const schema = Joi.object().keys({
            itemName: Joi.string()
                .required(),
            price: Joi.number()
                .min(1000)
                .max(1000000)
                .required(),
            variants: Joi.array(),
            description: Joi.string()
                .required(),
            foodType: Joi.string()
                .required()
        })
        try {
            if (req.files.length === 0) {
                throw ({
                    message: "Cần ít nhất một ảnh",
                    status: 403,
                    data: null
                })
            }

            // false later
            if (!req.headers.authorization) {
                throw ({
                    message: "Unauthorized action",
                    status: 403,
                    data: null
                })
            }

            const token = req.headers.authorization.split(' ')[1];

            tokenService.verifyToken(token);
            const user = await tokenService.infoToken(token)
            if (user.ROLE !== 'admin') {
                throw ({
                    message: "Unauthorized action",
                    status: 403,
                    data: null
                })
            }


            await schema.validateAsync({
                itemName,
                price,
                discount,
                variants: JSON.parse(variants),
                description,
                food_type
            })
            next()
        }
        catch (e) {
            if (req.files.length > 0) {
                const files = req.files;
                files.map(e => fs.unlinkSync(filePath + '\\' + e.path))
            }
            next(e)
        }
    }
    async updateItem(req, res, next) {
        const { itemName, price, description } = req.body;
        const schema = Joi.object().keys({
            itemName: Joi.string()
                .required(),
            price: Joi.number()
                .min(10000)
                .max(1000000)
                .required(),
            description: Joi.string()
                .required(),
        })
        try {
            if (!req.headers.authorization) {
                throw ({ message: 'No credentials sent!', status: 403, data: null })
            }

            const token = req.headers.authorization.split(' ')[1]

            tokenService.verifyToken(token);
            const user = await tokenService.infoToken(token)
            if (user.ROLE !== 'admin') {
                throw ({
                    message: "Unauthorized action",
                    status: 403,
                    data: null
                })
            }
            const ID = req.params.id;
            const existedItem = itemModel.findOne({ ID, deleted: false })
            if (!existedItem) {
                throw ({
                    message: "Item does not exist",
                    status: 404,
                    data: null
                })
            }
            await schema.validateAsync({
                itemName,
                price,
                description,
            })
            next()
        }
        catch (e) {
            next(e)
        }
    }
    async deleteItem(req, res, next) {
        try {
            if (!req.headers.authorization) {
                throw ({ message: 'No credentials sent!', status: 403, data: null })
            }

            const token = req.headers.authorization.split(' ')[1]

            tokenService.verifyToken(token);
            const user = await tokenService.infoToken(token)
            if (user.ROLE !== 'admin') {
                throw ({
                    message: "Unauthorized action",
                    status: 403,
                    data: null
                })
            }
            next()
        }
        catch (e) {
            next(e)
        }
    }
}

const itemMiddleware = new itemHandler();
export default itemMiddleware