import { itemModel } from "../models/item.model.js";
import { userModel } from "../models/user.model.js";

class userHandler {
    async createUser(phoneNumber, userName, password, salt, avatar) {
        try {
            const newUser = await userModel.create({
                phoneNumber,
                userName,
                password,
                salt,
                role: "user",
                profilePicture: avatar
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
    async updateUser(user, payload) {
        try {
            const updatedUser = await userModel.findOneAndUpdate(user, payload, { new: true })
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