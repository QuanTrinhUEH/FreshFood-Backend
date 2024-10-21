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
                $facet: {
                    totalCount: [{ $count: "count" }],
                    documents: [
                        { $skip: skip },
                        { $limit: pageSize },
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
        const item = await itemModel.findOne({ _id: id });
        return item;
    }
}

const itemService = new ItemService();
export default itemService;