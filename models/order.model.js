import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'item', required: true },
    quantity: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['online', 'cash'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
  promotionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' },
  createdAt: { type: Date, default: Date.now }
});

export const orderModel = mongoose.model('Order', orderSchema);