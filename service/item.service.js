import { itemModel } from "../models/item.model.js";

class ItemService {
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
}

const itemService = new ItemService();
export default itemService;