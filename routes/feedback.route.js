import { Router } from "express";
import feedbackController from "../controllers/feedback.controller.js";
import feedbackMiddleware from "../middlewares/feedback.middleware.js";

const feedbackRouter = Router();

feedbackRouter.post('/submit', feedbackMiddleware.submitFeedback, feedbackController.submitFeedback);
feedbackRouter.get('/get-all', feedbackController.getAllFeedback);
feedbackRouter.put('/update-status/:id', feedbackMiddleware.updateFeedbackStatus, feedbackController.updateFeedbackStatus);
feedbackRouter.delete('/delete/:id', feedbackMiddleware.deleteFeedback, feedbackController.deleteFeedback);

export default feedbackRouter;

