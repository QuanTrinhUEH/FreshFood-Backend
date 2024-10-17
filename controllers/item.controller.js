import { itemModel } from "../models/item.model.js";
import cloudinaryService from "../service/cloudinary.service.js";
import { convertTagsToHtml } from "../utils/regex.js";
import fs from 'fs';

const filePath = fs.realpathSync('./');

class itemHandler {
    async getAllItems(req, res, next) {
        const page = parseInt(req.query.p);
        try {
            const allItems = await itemModel.find({ deleted: false })
            if (allItems.length === 0) {
                return res.status(404).json({
                    message: "No item in database available",
                    status: 404,
                    data: null
                });
            }
            const itemsPerPage = 8;
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageItems = allItems.slice(startIndex, endIndex);
            return res.status(200).json({
                message: "Successfully",
                status: 200,
                data: {
                    items: pageItems
                }
            })
        }
        catch (e) {
            next(e)
        }
    }
    async getItemType(req, res, next) {
        const page = parseInt(req.query.p);
        const type = req.query.type;
        try {
            const items = await itemModel.find({ foodType: type, deleted: false })
            if (items.length === 0) {
                return res.status(404).json({
                    message: "No item in database available",
                    status: 404,
                    data: null
                })
            }

            const pageCount = Math.ceil(items.length / 8);
            if (page > pageCount) {
                page = pageCount
            }


            return res.status(200).json({
                message: "Successfully",
                status: 200,
                data: {
                    items: page ? items.slice(0, page * 8) : items,
                }
            })
        }
        catch (e) {
            next(e)
        }
    }
    async getItem(req, res, next) {
        try {
            const id = req.query.id;
            const item = await itemModel.findOne({ _id: id, deleted: false })
            if (!item) {
                return res.status(404).json({
                    message: "Item not found",
                    status: 404,
                    data: null
                })
            }
            return res.status(200).json({
                message: "Successfully get an item",
                status: 200,
                data: {
                    item
                }
            })
        }
        catch (e) {
            next(e)
        }
    }
    async searchItem(req, res, next) {
        try {
            const name = req.query.name;
            const items = await itemModel.find({
                itemName: {
                    $regex: name,
                    $options: 'i'
                },
                deleted: false
            })
            if (items.length === 0) {
                return res.status(404).json({
                    message: "No item in database available",
                    status: 404,
                    data: null
                })
            }
            else {
                return res.status(200).json({
                    message: "Successfully",
                    status: 200,
                    data: {
                        items,
                    }
                })
            }
        }
        catch (e) {
            next(e)
        }
    }
    async createItem(req, res, next) {
        const { itemName, price, variants, description, foodType, quantity } = req.body;
        const files = req.files;

        try {
            const data = await cloudinaryService.postMultipleImages(files.map(e => filePath + '\\' + e.path), 'food_img')
            await files.map(e => fs.unlinkSync(filePath + '\\' + e.path))

            const newDescription = convertTagsToHtml(description, data.map(e => e.url))

            const newItem = await itemModel.create({
                itemName,
                price,
                variants: JSON.parse(variants),
                description: newDescription,
                images: data.map(e => e.url),
                foodType,
                deleted: false,
                quantity
            })

            return res.status(201).json({
                message: 'Successfully created new item',
                status: 201,
                data: {
                    item: {
                        itemName: newItem.itemName,
                        price: newItem.price,
                        variants: newItem.variants,
                        description: newItem.description,
                        images: newItem.images,
                        foodType: newItem.foodType,
                        quantity: newItem.quantity
                    }
                }
            })
        }
        catch (e) {
            next(e)
        }
    }
    async updateItem(req, res, next) {
        const id = req.params.id;
        const { itemName, price, description } = req.body;

        const newItem = await itemModel.findOneAndUpdate({ _id: id }, { itemName, price, description })

        return res.status(201).json({
            message: "Updated successfully",
            status: 201,
            data: {
                item: {
                    itemName: newItem.itemName,
                    price: newItem.price,
                    variants: newItem.variants,
                    description: newItem.description,
                    images: newItem.images,
                    foodType: newItem.foodType,
                    quantity: newItem.quantity
                }
            }
        })
    }
    async deleteItem(req, res, next) {
        try {
            const id = req.params.id;
            await itemModel.findOneAndUpdate({ _id: id }, { deleted: true, quantity: 0 })
            return res.status(202).json({
                message: "Deleted successfully",
                status: 202,
                data: null
            })
        }
        catch (e) {
            next(e)
        }
    }
}

const itemController = new itemHandler();
export default itemController
