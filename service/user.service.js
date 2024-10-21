import { userModel } from "../models/user.model.js";

class userHandler {
    async register(phoneNumber, userName, password, salt) {
        try {
            const newUser = await userModel.create({
                phoneNumber,
                userName,
                password,
                salt,
                role: "user"
            })

            return newUser
        }
        catch (e) {
            throw (
                {
                    message: e.message || e,
                    status: 500,
                    data: null
                }
            )
        }
    }
    async updateUser(id, updateData) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true });
            return updatedUser
        }
        catch (e) {
            throw (
                {
                    message: e.message,
                    status: 500,
                    data: null
                }
            )
        }
    }
}

const userService = new userHandler();
export default userService;