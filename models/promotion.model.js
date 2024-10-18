import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  discountPercentage: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  applicableItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'item' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const promotionModel = mongoose.model('Promotion', promotionSchema);
