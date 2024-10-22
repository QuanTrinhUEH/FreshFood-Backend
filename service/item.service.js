import { itemModel } from "../models/item.model.js";

class ItemService {
    async createItem(itemName, price, variants, description, images, foodType, promotion) {
        const newItem = await itemModel.create({
            itemName,
            price,
            variants,
            description,
            images,
            foodType,
            promotion
        });
        return newItem;
    }
    async updateItem(id, updateData) {
        const updatedItem = await itemModel.findOneAndUpdate({ _id: id }, updateData, { new: true });
        return updatedItem;
    }
    async getItems(filters, page, pageSize) {
        const skip = (page - 1) * pageSize;

        const results = await itemModel.aggregate([
            { $match: filters },
            {
                $lookup: {
                    from: "promotions",
                    localField: "promotion",
                    foreignField: "_id",
                    as: "promotion"
                }
            },
            {
                $unwind: {
                    path: "$promotion",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    documents: [
                        { $skip: skip },
                        { $limit: pageSize },
                        {
                            $project: {
                                _id: 1,
                                itemName: 1,
                                price: 1,
                                variants: 1,
                                description: 1,
                                images: 1,
                                foodType: 1,
                                status: 1,
                                promotion: {
                                    _id: 1,
                                    promotionName: 1,
                                    discountPercentage: 1
                                },
                                createdAt: 1,
                                updatedAt: 1
                            }
                        }
                    ]
                }
            }
        ]);

        const totalItemsCount = results[0].totalCount[0]
            ? results[0].totalCount[0].count
            : 0;
        const items = results[0].documents;

        return { items, totalItemsCount };
    }
    async getItem(id) {
        const item = await itemModel.findOne({ _id: id }).populate("promotion");
        return item;
    }
    async getItemsWithPromotions(page, pageSize) {
        const skip = (page - 1) * pageSize;

        const results = await itemModel.aggregate([
            { $match: { promotion: { $exists: true, $ne: null }, status: 1 } },
            {
                $lookup: {
                    from: "promotions",
                    localField: "promotion",
                    foreignField: "_id",
                    as: "promotionDetails"
                }
            },
            { $unwind: "$promotionDetails" },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    items: [
                        { $skip: skip },
                        { $limit: pageSize },
                        {
                            $project: {
                                _id: 1,
                                itemName: 1,
                                price: 1,
                                images: 1,
                                foodType: 1,
                                promotion: {
                                    _id: "$promotionDetails._id",
                                    promotionName: "$promotionDetails.promotionName",
                                    discountPercentage: "$promotionDetails.discountPercentage"
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        const totalItemsCount = results[0].totalCount[0] ? results[0].totalCount[0].count : 0;
        const items = results[0].items;

        return { items, totalItemsCount };
    }
    async getItemsByFoodType(foodType, page, pageSize) {
        const skip = (page - 1) * pageSize;

        const results = await itemModel.aggregate([
            { $match: { foodType: foodType, status: 1 } },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    items: [
                        { $skip: skip },
                        { $limit: pageSize },
                        {
                            $project: {
                                _id: 1,
                                itemName: 1,
                                price: 1,
                                images: 1,
                                foodType: 1,
                                promotion: 1
                            }
                        }
                    ]
                }
            }
        ]);

        const totalItemsCount = results[0].totalCount[0] ? results[0].totalCount[0].count : 0;
        const items = results[0].items;

        return { items, totalItemsCount };
    }
}

const itemService = new ItemService();
export default itemService;
