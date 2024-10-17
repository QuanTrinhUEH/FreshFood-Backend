import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, unique: true, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'customer'] },
    profilePicture: { type: String, default: 'https://freesvg.org/img/abstract-user-flat-4.png' }
}, { timestamps: true });

export const userModel = mongoose.model('User', userSchema)
