import { Router } from "express";
import feedbackController from "../controllers/feedback.controller.js";
import feedbackMiddleware from "../middlewares/feedback.middleware.js";
import { authentication, authorization } from "../middlewares/auth.middleware.js";

const feedbackRouter = Router();

feedbackRouter.get('/', authentication, feedbackController.getAllFeedback);
feedbackRouter.post('/submit', authentication, authorization("user"), feedbackMiddleware.submitFeedback, feedbackController.submitFeedback);
feedbackRouter.put('/status/:id', authentication, authorization("admin"), feedbackMiddleware.updateFeedbackStatus, feedbackController.updateFeedbackStatus);

export default feedbackRouter;

