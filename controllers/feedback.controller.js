import { feedbackModel } from "../models/feedback.model.js";

class feedbackHandler {
  async submitFeedback(req, res, next) {
    try {
      const { feedback } = req.body;
      const userId = req.user.id; // Assuming you have user authentication middleware

      const newFeedback = await feedbackModel.create({
        user: userId,
        feedback
      });

      res.status(201).json({
        message: "Feedback submitted successfully",
        status: 201,
        data: { feedback: newFeedback }
      });
    } catch (e) {
      next(e);
    }
  }

  async getAllFeedback(req, res, next) {
    try {
      const feedback = await feedbackModel.find().populate('user', 'username');
      res.status(200).json({
        message: "Feedback retrieved successfully",
        status: 200,
        data: { feedback }
      });
    } catch (e) {
      next(e);
    }
  }

  async updateFeedbackStatus(req, res, next) {
    try {
      const { status } = req.body;
      const updatedFeedback = await feedbackModel.findByIdAndUpdate(
        req.params.id,
        { status, updatedAt: Date.now() },
        { new: true }
      );
      if (!updatedFeedback) {
        return res.status(404).json({
          message: "Feedback not found",
          status: 404,
          data: null
        });
      }
      res.status(200).json({
        message: "Feedback status updated successfully",
        status: 200,
        data: { feedback: updatedFeedback }
      });
    } catch (e) {
      next(e);
    }
  }

  async deleteFeedback(req, res, next) {
    try {
      const deletedFeedback = await feedbackModel.findByIdAndDelete(req.params.id);
      if (!deletedFeedback) {
        return res.status(404).json({
          message: "Feedback not found",
          status: 404,
          data: null
        });
      }
      res.status(200).json({
        message: "Feedback deleted successfully",
        status: 200,
        data: null
      });
    } catch (e) {
      next(e);
    }
  }
}

const feedbackController = new feedbackHandler();
export default feedbackController;

