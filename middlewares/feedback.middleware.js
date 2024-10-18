import Joi from "joi";

class feedbackHandler {
  async submitFeedback(req, res, next) {
    const schema = Joi.object().keys({
      feedback: Joi.string().required()
    });

    try {
      await schema.validateAsync(req.body);
      next();
    } catch (e) {
      next(e);
    }
  }

  async updateFeedbackStatus(req, res, next) {
    const schema = Joi.object().keys({
      status: Joi.string().valid('pending', 'reviewed', 'responded').required()
    });

    try {
      await schema.validateAsync(req.body);
      next();
    } catch (e) {
      next(e);
    }
  }

  async deleteFeedback(req, res, next) {
    // Add any necessary authorization checks here
    next();
  }
}

const feedbackMiddleware = new feedbackHandler();
export default feedbackMiddleware;

