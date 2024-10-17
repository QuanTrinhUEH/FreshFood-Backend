import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['online', 'cash'], required: true },
  transactionId: String,
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
  createdAt: { type: Date, default: Date.now }
});

export const paymentModel = mongoose.model('Payment', paymentSchema);
