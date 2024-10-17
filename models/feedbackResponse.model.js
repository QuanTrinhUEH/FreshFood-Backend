import mongoose from "mongoose";

const feedbackResponseSchema = new mongoose.Schema({
  feedbackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback', required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responseText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const feedbackResponseModel = mongoose.model('FeedbackResponse', feedbackResponseSchema);
