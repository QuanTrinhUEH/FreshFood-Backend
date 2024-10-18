import mongoose, { Types } from "mongoose";

const tokenSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', require: true, unique: true },
    refreshToken: { type: String, unique: true }
});

export const tokenModel = mongoose.model('Token', tokenSchema)