import Joi from "joi";

class promotionHandler {
  async createPromotion(req, res, next) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().required(),
      discountPercentage: Joi.number().min(0).max(100).required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().greater(Joi.ref('startDate')).required()
    });

    try {
      await schema.validateAsync(req.body);
      next();
    } catch (e) {
      next(e);
    }
  }

  async updatePromotion(req, res, next) {
    const schema = Joi.object().keys({
      name: Joi.string(),
      description: Joi.string(),
      discountPercentage: Joi.number().min(0).max(100),
      startDate: Joi.date(),
      endDate: Joi.date().greater(Joi.ref('startDate')),
      isActive: Joi.boolean()
    });

    try {
      await schema.validateAsync(req.body);
      next();
    } catch (e) {
      next(e);
    }
  }

  async deletePromotion(req, res, next) {
    // Add any necessary authorization checks here
    next();
  }
}

const promotionMiddleware = new promotionHandler();
export default promotionMiddleware;

