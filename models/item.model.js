import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    itemName: { type: String, require: true },
    price: { type: Number, require: true },
    variants: [],
    description: { type: String, require: true },
    images: { type: Array, require: true },
    food_type: { type: String, required: true },
    ID: { type: Number, require: true, unique: true },
    deleted: { type: Boolean, require: true },
    currentPromotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' }
});

export const itemModel = mongoose.model('Item', itemSchema)