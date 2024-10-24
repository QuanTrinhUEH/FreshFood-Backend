import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  promotionName: { type: String, required: true },
  description: { type: String, required: true },
  discountPercentage: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: Number, enum: [0, 1], default: 1, require: true },
  applicableItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const promotionModel = mongoose.model('Promotion', promotionSchema);
