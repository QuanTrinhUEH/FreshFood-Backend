import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    owner: { type: String, require: true, unique: true },
    refreshToken: { type: String, unique: true }
});

export const tokenModel = mongoose.model('Token', tokenSchema)