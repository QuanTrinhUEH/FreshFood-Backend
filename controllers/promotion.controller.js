import { promotionModel } from "../models/promotion.model.js";
import { itemModel } from "../models/item.model.js";

class promotionHandler {
  async createPromotion(req, res, next) {
    try {
      const { name, description, discountPercentage, startDate, endDate } = req.body;
      const newPromotion = await promotionModel.create({
        name,
        description,
        discountPercentage,
        startDate,
        endDate
      });

      res.status(201).json({
        message: "Promotion created successfully",
        status: 201,
        data: { promotion: newPromotion }
      });
    } catch (e) {
      next(e);
    }
  }

  async getAllPromotions(req, res, next) {
    try {
      const promotions = await promotionModel.find({ isActive: true });
      res.status(200).json({
        message: "Promotions retrieved successfully",
        status: 200,
        data: { promotions }
      });
    } catch (e) {
      next(e);
    }
  }

  async getPromotion(req, res, next) {
    try {
      const promotion = await promotionModel.findById(req.params.id);
      if (!promotion) {
        return res.status(404).json({
          message: "Promotion not found",
          status: 404,
          data: null
        });
      }
      res.status(200).json({
        message: "Promotion retrieved successfully",
        status: 200,
        data: { promotion }
      });
    } catch (e) {
      next(e);
    }
  }

  async updatePromotion(req, res, next) {
    try {
      const updatedPromotion = await promotionModel.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: Date.now() },
        { new: true }
      );
      if (!updatedPromotion) {
        return res.status(404).json({
          message: "Promotion not found",
          status: 404,
          data: null
        });
      }
      res.status(200).json({
        message: "Promotion updated successfully",
        status: 200,
        data: { promotion: updatedPromotion }
      });
    } catch (e) {
      next(e);
    }
  }

  async deletePromotion(req, res, next) {
    try {
      const deletedPromotion = await promotionModel.findByIdAndDelete(req.params.id);
      if (!deletedPromotion) {
        return res.status(404).json({
          message: "Promotion not found",
          status: 404,
          data: null
        });
      }
      res.status(200).json({
        message: "Promotion deleted successfully",
        status: 200,
        data: null
      });
    } catch (e) {
      next(e);
    }
  }

  async addItemToPromotion(req, res, next) {
    try {
      const { promotionId, itemId } = req.params;
      const promotion = await promotionModel.findById(promotionId);
      const item = await itemModel.findById(itemId);

      if (!promotion || !item) {
        return res.status(404).json({
          message: "Promotion or Item not found",
          status: 404,
          data: null
        });
      }

      if (!promotion.applicableItems.includes(itemId)) {
        promotion.applicableItems.push(itemId);
        await promotion.save();
      }

      item.currentPromotion = promotionId;
      await item.save();

      res.status(200).json({
        message: "Item added to promotion successfully",
        status: 200,
        data: { promotion, item }
      });
    } catch (e) {
      next(e);
    }
  }

  async removeItemFromPromotion(req, res, next) {
    try {
      const { promotionId, itemId } = req.params;
      const promotion = await promotionModel.findById(promotionId);
      const item = await itemModel.findById(itemId);

      if (!promotion || !item) {
        return res.status(404).json({
          message: "Promotion or Item not found",
          status: 404,
          data: null
        });
      }

      promotion.applicableItems = promotion.applicableItems.filter(id => id.toString() !== itemId);
      await promotion.save();

      if (item.currentPromotion && item.currentPromotion.toString() === promotionId) {
        item.currentPromotion = null;
        await item.save();
      }

      res.status(200).json({
        message: "Item removed from promotion successfully",
        status: 200,
        data: { promotion, item }
      });
    } catch (e) {
      next(e);
    }
  }
}

const promotionController = new promotionHandler();
export default promotionController;
