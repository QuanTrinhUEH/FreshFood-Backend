import { itemModel } from "../models/item.model.js";
import { promotionModel } from "../models/promotion.model.js";
import mongoose from "mongoose";

class PromotionService {
    async createPromotion(promotionName, description, discountPercentage, startDate, endDate, applicableItems) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const newPromotion = await promotionModel.create([{
                promotionName,
                description,
                discountPercentage,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                applicableItems
            }], { session });

            // Update items with the new promotion
            const updateResult = await itemModel.updateMany(
                { _id: { $in: applicableItems } },
                { $set: { promotion: newPromotion[0]._id } },
                { session }
            );

            // Check if the update was successful
            if (updateResult.modifiedCount !== applicableItems.length) {
                throw new Error('Không thể cập nhật tất cả các sản phẩm với khuyến mãi mới');
            }

            await session.commitTransaction();
            return newPromotion[0];
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
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
        const skip = (page - 1) * pageSize;

        const results = await promotionModel.aggregate([
            { $match: filters },
            {
                $lookup: {
                    from: "items",
                    localField: "applicableItems",
                    foreignField: "_id",
                    as: "applicableItems"
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
                                promotionName: 1,
                                description: 1,
                                discountPercentage: 1,
                                startDate: 1,
                                endDate: 1,
                                status: 1,
                                applicableItems: {
                                    $map: {
                                        input: "$applicableItems",
                                        as: "item",
                                        in: {
                                            _id: "$$item._id",
                                            itemName: "$$item.itemName",
                                            price: "$$item.price"
                                        }
                                    }
                                },
                                createdAt: 1,
                                updatedAt: 1
                            }
                        }
                    ]
                }
            }
        ]);

        const totalPromotionsCount = results[0].totalCount[0]
            ? results[0].totalCount[0].count
            : 0;
        const promotions = results[0].documents;

        return { promotions, totalPromotionsCount };
    }
    async getPromotion(promotionId) {
        const promotion = await promotionModel.findById(promotionId).populate('applicableItems');
        return promotion;
    }
}

const promotionService = new PromotionService();
export default promotionService;
