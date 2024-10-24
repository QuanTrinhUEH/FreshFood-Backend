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
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal server error",
        status: error.status || 500,
        data: error.data || null
      });
    }
  }

  async getPromotions(req, res, next) {
    try {
      const { search = "", page = 1, pageSize = 10 } = req.query;

      const maxPageSize = 100;
      const limitedPageSize = Math.min(pageSize, maxPageSize);

      const filters = search
        ? { promotionName: { $regex: search, $options: "i" } } : {};
      filters.status = 1;

      const { promotions, totalPromotionsCount } = await promotionService.getPromotions(filters, page, limitedPageSize);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách khuyến mãi thành công",
        data: {
          promotions,
          totalPages: Math.ceil(totalPromotionsCount / limitedPageSize),
          totalCount: totalPromotionsCount,
          currentPage: Number(page)
        },
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal server error",
        status: error.status || 500,
        data: error.data || null
      });
    }
  }

  async getPromotion(req, res, next) {
    try {
      const promotion = await promotionService.getPromotion(req.params.id);
      if (!promotion) {
        return res.status(404).json({
          message: "Khuyến mãi không tồn tại",
          status: 404,
          data: null
        });
      }
      res.status(200).json({
        message: "Lấy thông tin khuyến mãi thành công",
        status: 200,
        data: { promotion }
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal server error",
        status: error.status || 500,
        data: error.data || null
      });
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
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal server error",
        status: error.status || 500,
        data: error.data || null
      });
    }
  }
}

const promotionController = new promotionHandler();
export default promotionController;
