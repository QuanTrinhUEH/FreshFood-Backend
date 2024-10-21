import { promotionModel } from "../models/promotion.model.js";
import promotionService from "../service/promotion.service.js";

class promotionHandler {
  async createPromotion(req, res, next) {
    try {
      const { promotionName, description, discountPercentage, startDate, endDate, applicableItems } = req.body;

      const newPromotion = await promotionService.createPromotion(promotionName, description, discountPercentage, startDate, endDate, applicableItems);

      res.status(201).json({
        message: "Tạo khuyến mãi thành công",
        status: 201,
        data: { promotion: newPromotion }
      });
    } catch (e) {
      next(e);
    }
  }

  async getPromotions(req, res, next) {
    try {
      const promotions = await promotionModel.find().populate('applicableItems');
      res.status(200).json({
        message: "Lấy danh sách khuyến mãi thành công",
        status: 200,
        data: { promotions }
      });
    } catch (e) {
      next(e);
    }
  }

  async getPromotion(req, res, next) {
    try {
      const promotion = await promotionModel.findById(req.params.id).populate('applicableItems');
      if (!promotion) {
        return res.status(404).json({
          message: "Không tìm thấy khuyến mãi",
          status: 404,
          data: null
        });
      }
      res.status(200).json({
        message: "Lấy thông tin khuyến mãi thành công",
        status: 200,
        data: { promotion }
      });
    } catch (e) {
      next(e);
    }
  }

  async updatePromotion(req, res, next) {
    try {
      const { promotionName, description, discountPercentage, startDate, endDate, status, applicableItems } = req.body;
      const updatedPromotion = await promotionService.updatePromotion(req.params.id, promotionName, description, discountPercentage, startDate, endDate, status, applicableItems);
      res.status(200).json({
        message: "Cập nhật khuyến mãi thành công",
        status: 200,
        data: { promotion: updatedPromotion }
      });
    } catch (e) {
      next(e);
    }
  }
}

const promotionController = new promotionHandler();
export default promotionController;
