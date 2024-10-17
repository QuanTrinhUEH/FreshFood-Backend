import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    price: { type: Number, required: true },
    variants: [],
    description: { type: String },
    images: { type: Array, required: true },
    foodType: { type: String, required: true },
    deleted: { type: Boolean, required: true },
    quantity: { type: Number, required: true, min: 0 }
}, { timestamps: true });

export const itemModel = mongoose.model('Item', itemSchema)