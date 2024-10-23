import Joi from "joi";
import { itemModel } from "../models/item.model.js";
import { promotionModel } from "../models/promotion.model.js";

class promotionHandler {
  async createPromotion(req, res, next) {
    const { promotionName, description, discountPercentage, startDate, endDate, applicableItems } = req.body;
    const schema = Joi.object().keys({
      promotionName: Joi.string()
        .required(),
      description: Joi.string()
        .required(),
      discountPercentage: Joi.number()
        .min(0)
        .max(100)
        .required(),
      startDate: Joi.string()
        .isoDate()
        .required()
        .messages({
          'string.isoDate': 'Ngày bắt đầu phải có định dạng YYYY-MM-DD',
          'any.required': 'Ngày bắt đầu không được để trống'
        }),
      endDate: Joi.string()
        .isoDate()
        .required()
        .custom((value, helpers) => {
          if (new Date(value) <= new Date(helpers.state.ancestors[0].startDate)) {
            return helpers.error('date.greater');
          }
          return value;
        })
        .messages({
          'string.isoDate': 'Ngày kết thúc phải có định dạng YYYY-MM-DD',
          'any.required': 'Ngày kết thúc không được để trống',
          'date.greater': 'Ngày kết thúc phải sau ngày bắt đầu'
        }),
      applicableItems: Joi.array()
        .items(Joi.string()
          .hex()
          .length(24)
          .required()
          .messages({
            'string.hex': 'ID sản phẩm không hợp lệ',
            'string.length': 'ID sản phẩm không hợp lệ',
            'any.required': 'Sản phẩm áp dụng không được để trống'
          }))
        .required()
        .messages({
          'array.base': 'Danh sách sản phẩm áp dụng phải là một mảng',
          'any.required': 'Danh sách sản phẩm áp dụng không được để trống'
        })
    });

    try {
      await schema.validateAsync({
        promotionName,
        description,
        discountPercentage,
        startDate,
        endDate,
        applicableItems
      });
      // Check if all items exist
      const items = await itemModel.find({ _id: { $in: applicableItems } });
      if (items.length !== applicableItems.length) {
        return res.status(400).json({
          message: "Một hoặc nhiều sản phẩm không tồn tại",
          status: 400,
          data: null
        });
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  async updatePromotion(req, res, next) {
    const { promotionName, description, discountPercentage, startDate, endDate, status, applicableItems } = req.body;

    const schema = Joi.object().keys({
      promotionName: Joi.string(),
      description: Joi.string(),
      discountPercentage: Joi.number()
        .min(0)
        .max(100)
        .messages({
          'number.min': 'Phần trăm giảm giá phải lớn hơn hoặc bằng 0',
          'number.max': 'Phần trăm giảm giá phải nhỏ hơn hoặc bằng 100',
        }),
      startDate: Joi.date()
        .iso()
        .messages({
          'date.base': 'Ngày bắt đầu không hợp lệ',
          'date.format': 'Ngày bắt đầu phải có định dạng YYYY-MM-DD'
        }),
      endDate: Joi.date()
        .iso()
        .when('startDate', {
          is: Joi.exist(),
          then: Joi.date().greater(Joi.ref('startDate')).required(),
          otherwise: Joi.optional()
        })
        .messages({
          'date.base': 'Ngày kết thúc không hợp lệ',
          'date.format': 'Ngày kết thúc phải có định dạng YYYY-MM-DD',
          'date.greater': 'Ngày kết thúc phải sau ngày bắt đầu',
          'any.required': 'Ngày kết thúc không được để trống khi có ngày bắt đầu'
        }),
      status: Joi.number()
        .valid(0, 1)
        .messages({
          'any.only': 'Trạng thái không hợp lệ'
        }),
      applicableItems: Joi.array()
        .items(Joi.string()
          .hex()
          .length(24)
          .messages({
            'string.hex': 'ID sản phẩm không hợp lệ',
            'string.length': 'ID sản phẩm không hợp lệ',
          }))
        .messages({
          'array.base': 'Danh sách sản phẩm áp dụng phải là một mảng'
        })
    });

    try {
      await schema.validateAsync({
        promotionName,
        description,
        discountPercentage,
        startDate,
        endDate,
        status,
        applicableItems
      });
      // Check if all items exist
      const items = await itemModel.find({ _id: { $in: applicableItems } });
      if (items.length !== applicableItems.length) {
        return res.status(400).json({
          message: "Một hoặc nhiều sản phẩm không tồn tại",
          status: 400,
          data: null
        });
      }
      const promotion = await promotionModel.findById(req.params.id);
      if (!promotion) {
        return res.status(404).json({
          message: "Khuyến mãi không tồn tại",
          status: 404,
          data: null
        });
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  async getPromotions(req, res, next) {
    const schema = Joi.object({
      page: Joi.number()
        .integer()
        .min(1)
        .optional()
        .messages({
          "number.base": "Số trang không hợp lệ",
          "number.min": "Số trang phải lớn hơn 0"
        }),
      pageSize: Joi.number()
        .integer()
        .min(1)
        .optional()
        .messages({
          "number.base": "Số trang không hợp lệ",
          "number.min": "Số trang phải lớn hơn 0"
        }),
      search: Joi.string()
        .optional()
        .allow("")
        .messages({
          "string.base": "Tìm kiếm không hợp lệ"
        })
    });

    try {
      const value = await schema.validateAsync(req.query);
      req.query = value;
      next();
    } catch (e) {
      next(e);
    }
  }
  async getPromotion(req, res, next) {
    const schema = Joi.object({
      id: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
          'string.hex': 'ID khuyến mãi không hợp lệ',
          'string.length': 'ID khuyến mãi không hợp lệ',
          'any.required': 'ID khuyến mãi không được để trống'
        })
    });
    try {
      const { id } = await schema.validateAsync(req.params);
      const promotion = await promotionModel.findById(id);
      if (!promotion) {
        return res.status(404).json({
          message: "Khuyến mãi không tồn tại",
          status: 404,
          data: null
        });
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

const promotionMiddleware = new promotionHandler();
export default promotionMiddleware;
