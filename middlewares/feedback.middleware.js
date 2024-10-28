import Joi from "joi";

class feedbackHandler {
  async submitFeedback(req, res, next) {
    const { feedback } = req.body;
    const schema = Joi.object({
      feedback: Joi.string()
        .required()
        .messages({
          "string.base": "Feedback không hợp lệ",
          "any.required": "Feedback không được để trống"
        })
    });
    
    try {
      await schema.validateAsync({ feedback });
      next();
    } catch (e) {
      next(e);
    }
  }

  async updateFeedbackStatus(req, res, next) {
    const schema = Joi.object().keys({
      status: Joi.string()
        .valid('pending', 'reviewed', 'responded')
        .required()
        .messages({
          "string.base": "Trạng thái không hợp lệ",
          "any.required": "Trạng thái không được để trống"
        })
    });

    try {
      await schema.validateAsync(req.body);
      next();
    } catch (e) {
      next(e);
    }
  }
}

const feedbackMiddleware = new feedbackHandler();
export default feedbackMiddleware;

