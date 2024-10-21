import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ID: { type: String, require: true, unique: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});

export const billingModel = mongoose.model('Billing', billingSchema)