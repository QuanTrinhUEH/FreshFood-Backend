import Joi from "joi";
import tokenService from "../service/token.service.js";
import fs from 'fs';
import { itemModel } from "../models/item.model.js";

const filePath = fs.realpathSync('./');

class itemHandler {
    async createItem(req, res, next) {
        const { itemName, price, variants, description, foodType, quantity } = req.body
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
                .required(),
            quantity: Joi.number()
                .min(1)
                .required(),
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
            if (user.role !== 'admin') {
                throw ({
                    message: "Unauthorized action",
                    status: 403,
                    data: null
                })
            }


            await schema.validateAsync({
                itemName,
                price,
                variants: JSON.parse(variants),
                description,
                foodType,
                quantity
            })
            next()
        }
        catch (e) {
            console.log(req.files)
            if (req.files.length > 0) {
                const files = req.files;
                files.map(e => fs.unlinkSync(filePath + '\\' + e.path))
            }
            next(e)
        }
    }
    async updateItem(req, res, next) {
        const { itemName, price, description, quantity } = req.body;
        const schema = Joi.object().keys({
            itemName: Joi.string()
                .required(),
            price: Joi.number()
                .min(10000)
                .max(1000000)
                .required(),
            description: Joi.string()
                .required(),
            quantity: Joi.number()
                .min(1)
                .required()
        })
        try {
            if (!req.headers.authorization) {
                throw ({ message: 'No credentials sent!', status: 403, data: null })
            }

            const token = req.headers.authorization.split(' ')[1]

            tokenService.verifyToken(token);
            const user = await tokenService.infoToken(token)
            if (user.role !== 'admin') {
                throw ({
                    message: "Unauthorized action",
                    status: 403,
                    data: null
                })
            }
            const id = req.params.id;
            const existedItem = itemModel.findOne({ _id: id, deleted: false })
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
                quantity
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
            if (user.role !== 'admin') {
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