import { itemModel } from "../models/item.model.js";
import { userModel } from "../models/user.model.js";

class userHandler {
    async createUser(phoneNumber, userName, password, salt) {
        try {
            const newUser = await userModel.create({
                phoneNumber,
                userName,
                password,
                salt,
                role: "customer"
            });

            return newUser;
        } catch (error) {
            throw (
                {
                    message: error.message || error,
                    status: 500,
                    data: null
                }
            )
        }

    }

    async updateUser(user, payload) {
        try {
            const updatedUser = await userModel.findOneAndUpdate(user, payload, { new: true });
            return updatedUser;
        } catch (error) {
            throw (
                {
                    message: error.message,
                    status: 500,
                    data: null
                }
            )
        }
    }
}

const userService = new userHandler();
export default userService;