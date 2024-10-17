import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ID: { type: String, required: true, unique: true },
    items: []
});

export const billingModel = mongoose.model('Billing', billingSchema)