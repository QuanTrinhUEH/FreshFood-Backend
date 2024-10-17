import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const feedbackModel = mongoose.model('Feedback', feedbackSchema)