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
      status: Joi.number()
        .optional()
        .valid(0, 1)
        .messages({
          'number.base': 'Trạng thái không hợp lệ',
          'number.valid': 'Trạng thái không hợp lệ'
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
}

const promotionMiddleware = new promotionHandler();
export default promotionMiddleware;
