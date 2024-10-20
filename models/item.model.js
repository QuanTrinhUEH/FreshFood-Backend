import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    itemName: { type: String, require: true },
    price: { type: Number, require: true },
    variants: [],
    description: { type: String, require: true },
    images: { type: Array, require: true },
    foodType: { type: String, required: true },
    status: { type: Number, enum: [0, 1], default: 1, require: true },
    currentPromotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' }
});

export const itemModel = mongoose.model('Item', itemSchema)