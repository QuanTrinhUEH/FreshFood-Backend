import { itemModel } from "../models/item.model.js";
import cloudinaryService from "../service/cloudinary.service.js";
import { convertTagsToHtml } from "../utils/regex.js";
import fs from 'fs';

const filePath = fs.realpathSync('./');

class itemHandler {
    async getAllItems(req, res, next) {
        const page = parseInt(req.params.p);
        try {
            const allItems = await itemModel.find({ deleted: false })
            if (allItems.length === 0) {
                res.status(404).json({
                    message: "No item in database available",
                    status: 404,
                    data: null
                })
            }
            const pageCount = Math.ceil(allItems.length / 8);
            if (page > pageCount) {
                page = pageCount
            }
            res.status(200).json({
                message: "Successfully",
                status: 200,
                data: {
                    items: allItems.slice(0, page * 8)
                }
            })
        }
        catch (e) {
            next(e)
        }
    }
    async getItemType(req, res, next) {
        const page = parseInt(req.params.p);
        const type = req.params.type;
        try {
            const items = await itemModel.find({ food_type: type, deleted: false })
            if (items.length === 0) {
                res.status(404).json({
                    message: "No item in database available",
                    status: 404,
                    data: null
                })
            }

            const pageCount = Math.ceil(items.length / 8);
            if (page > pageCount) {
                page = pageCount
            }


            res.status(200).json({
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
            const item = await itemModel.findById(req.params.id).populate('currentPromotion');
            if (!item) {
                return res.status(404).json({
                    message: "Item not found",
                    status: 404,
                    data: null
                });
            }

            let discountedPrice = item.price;
            if (item.currentPromotion && item.currentPromotion.isActive) {
                const now = new Date();
                if (now >= item.currentPromotion.startDate && now <= item.currentPromotion.endDate) {
                    discountedPrice = item.price * (1 - item.currentPromotion.discountPercentage / 100);
                }
            }

            res.status(200).json({
                message: "Item retrieved successfully",
                status: 200,
                data: { 
                    ...item.toObject(), 
                    discountedPrice: Math.round(discountedPrice * 100) / 100 
                }
            });
        }
        catch (e) {
            next(e);
        }
    }
    async searchItem(req, res, next) {
        try {
            const name = req.params.name;
            const items = await itemModel.find({
                itemName: {
                    $regex: name,
                    $options: 'i'
                },
                deleted: false
            })
            if (items.length === 0) {
                res.status(404).json({
                    message: "No item in database available",
                    status: 404,
                    data: null
                })
            }
            else {
                res.status(200).json({
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
        const { itemName, price, discount, variants, description, food_type } = req.body;
        const files = req.files;

        try {
            const data = await cloudinaryService.postMultipleImages(files.map(e => filePath + '\\' + e.path), 'food_img')
            await files.map(e => fs.unlinkSync(filePath + '\\' + e.path))

            const ID = await itemModel.countDocuments();

            const newDescription = convertTagsToHtml(description, data.map(e => e.url))

            const newItem = await itemModel.create({
                itemName,
                price,
                discount,
                variants: JSON.parse(variants),
                description: newDescription,
                images: data.map(e => e.url),
                food_type,
                ID: ID + 1,
                deleted: false
            })

            res.json({
                message: 'Successfully created new item',
                status: 201,
                data: {
                    item: {
                        itemName: newItem.itemName,
                        price: newItem.price,
                        discount: newItem.discount,
                        variants: newItem.variants,
                        description: newItem.description,
                        images: newItem.images,
                        food_type: newItem.food_type,
                        ID: newItem.ID
                    }
                }
            })
        }
        catch (e) {
            next(e)
        }
    }
    async updateItem(req, res, next) {
        const ID = req.params.id;
        const { itemName, price, description } = req.body;

        const newItem = await itemModel.findOneAndUpdate({ ID }, { itemName, price, description })

        res.status(201).json({
            message: "Updated successfully",
            status: 201,
            data: {
                item: {
                    itemName: newItem.itemName,
                    price: newItem.price,
                    discount: newItem.discount,
                    variants: newItem.variants,
                    description: newItem.description,
                    images: newItem.images,
                    food_type: newItem.food_type,
                    ID: newItem.ID
                }
            }
        })
    }
    async deleteItem(req, res, next) {
        try {
            const ID = req.params.id;
            await itemModel.findOneAndUpdate({ ID }, { deleted: true })
            res.status(202).json({
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
