import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, unique: true, require: true },
    userName: { type: String, require: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    role: {type: String, require: true},
    profilePicture: {type: String, require: true, default: 'https://freesvg.org/img/abstract-user-flat-4.png'}
});

export const userModel = mongoose.model('User', userSchema)
