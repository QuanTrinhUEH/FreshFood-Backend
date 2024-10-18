import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    ID: { type: String, require: true, unique: true },
    items: []
});

export const billingModel = mongoose.model('Billing', billingSchema)