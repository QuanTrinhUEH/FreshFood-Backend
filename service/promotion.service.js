import { itemModel } from "../models/item.model.js";
import { promotionModel } from "../models/promotion.model.js";

class PromotionService {
    async createPromotion(promotionName, description, discountPercentage, startDate, endDate, applicableItems) {
        const newPromotion = await promotionModel.create({
            promotionName,
            description,
            discountPercentage,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            applicableItems
        });

        // Update items with the new promotion
        await itemModel.updateMany(
            { _id: { $in: applicableItems } },
            { $set: { promotion: newPromotion._id } }
        );
        return newPromotion;
    }
    async updatePromotion(promotionId, promotionName, description, discountPercentage, startDate, endDate, status, applicableItems) {
        const updatedPromotion = await promotionModel.findByIdAndUpdate(
            promotionId,
            {
                promotionName,
                description,
                discountPercentage,
                startDate,
                endDate,
                status,
                applicableItems,
                updatedAt: Date.now()
            },
            { new: true }
        ).populate('applicableItems');

        // Update items with the new promotion
        await itemModel.updateMany(
            { _id: { $in: applicableItems } },
            { $set: { promotion: updatedPromotion._id } }
        );

        // Remove promotion from items that are no longer applicable
        await itemModel.updateMany(
            { promotion: updatedPromotion._id, _id: { $nin: applicableItems } },
            { $unset: { promotion: "" } }
        );
        return updatedPromotion;
    }
    async getPromotions(filters, page, pageSize) {
        const promotions = await promotionModel.find(filters).populate('applicableItems').skip((page - 1) * pageSize).limit(pageSize);
        const totalPromotionsCount = await promotionModel.countDocuments(filters);
        return { promotions, totalPromotionsCount };
    }
    async getPromotion(promotionId) {
        const promotion = await promotionModel.findById(promotionId).populate('applicableItems');
        return promotion;
    }
}

const promotionService = new PromotionService();
export default promotionService;
