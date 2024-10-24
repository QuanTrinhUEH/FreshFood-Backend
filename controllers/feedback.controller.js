import { feedbackModel } from "../models/feedback.model.js";

class feedbackHandler {
  async submitFeedback(req, res, next) {
    try {
      console.log(req.headers.authorization);
      const { feedback } = req.body;
      const userId = req.user.id;

      const newFeedback = await feedbackModel.create({
        user: userId,
        feedback
      });

      res.status(201).json({
        message: "Feedback submitted successfully",
        status: 201,
        data: { feedback: newFeedback }
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

  async getAllFeedback(req, res, next) {
    try {
      const feedback = await feedbackModel.find().populate('user', 'username');
      res.status(200).json({
        message: "Feedback retrieved successfully",
        status: 200,
        data: { feedback }
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

const feedbackController = new feedbackHandler();
export default feedbackController;

