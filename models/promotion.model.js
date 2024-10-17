import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    discountType: { type: String, enum: ['percentage', 'fixed_amount'], required: true },
    discountValue: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
});

export const promotionModel = mongoose.model('Promotion', promotionSchema);
