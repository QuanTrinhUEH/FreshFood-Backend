import fs from 'fs'
import cloudinaryService from '../service/cloudinary.service.js';
import kryptoService from '../utils/hashing.js';
import userService from '../service/user.service.js';
import tokenService from '../service/token.service.js';
import refreshTokenService from '../service/refreshToken.service.js';
import { userModel } from '../models/user.model.js';
import { tokenModel } from '../models/token.model.js';



const filePath = fs.realpathSync('./')

class userHandler {
    async register(req, res, next) {
        try {
            const { phoneNumber, userName, password } = req.body;

            // encrypt password, salt and save in database
            const [newPassword, salt] = kryptoService.encrypt(password)
            const newUser = await userService.createUser(phoneNumber, userName, newPassword, salt)

            // create token and refresh token with new user as payload
            const token = tokenService.signToken({ userName: newUser.userName, password: newUser.password, role: newUser.role, profilePicture: newUser.profilePicture, phoneNumber: newUser.phoneNumber })
            const refreshToken = await refreshTokenService.createNew(token, newUser.phoneNumber);


            return res.status(201).json({
                success: true,
                message: "Register Successfully",
                status: 201,
                data: {
                    user: {
                        userName: newUser.userName,
                        role: newUser.role,
                        profilePicture: newUser.profilePicture,
                    },
                    token,
                    refreshToken,
                },
            });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    };
    async login(req, res, next) {
        try {
            const { phoneNumber } = req.body;
            const user = await userModel.findOne({ phoneNumber })
            const token = tokenService.signToken({ userName: user.userName, password: user.password, role: user.role, profilePicture: user.profilePicture, phoneNumber: user.phoneNumber })
            const refreshToken = await refreshTokenService.refreshNew(token, user.phoneNumber);

            return res.status(200).json({
                success: true,
                message: "Login Successfully",
                status: 200,
                data: {
                    user: {
                        userName: user.userName,
                        role: user.role,
                        profilePicture: user.profilePicture,
                    },
                    token,
                    refreshToken,
                },
            });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    }
    async updateProfile(req, res, next) {
        const { userName } = req.body;
        const token = req.headers.authorization.split(' ')[1]
        let avatar;

        try {
            const user = await tokenService.infoToken(token)
            if (req.file) {
                const avatarData = await cloudinaryService.postSingleImage(`${filePath}\\${req.file.path}`, avatar)
                fs.unlinkSync(`${filePath}\\${req.file.path}`)
                avatar = avatarData.url
            }
            else {
                avatar = false
            }


            const updatedUser = await userService.updateUser(user, { userName, profilePicture: avatar ? avatar : user.profilePicture, __v: user.__v + 1 })

            return res.status(201).json({
                success: true,
                message: "Update Successfully",
                status: 201,
                data: {
                    user: {
                        userName: updatedUser.userName,
                        role: updatedUser.role,
                        profilePicture: updatedUser.profilePicture,
                    }
                },
            });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    }
    async updatePassword(req, res, next) {
        try {
            const { newPassword } = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const user = await tokenService.infoToken(token);
            const [updatePassword, updateSalt] = kryptoService.encrypt(newPassword)
            const newUser = await userService.updateUser(user, { password: updatePassword, salt: updateSalt })

            const newToken = tokenService.signToken({ userName: newUser.userName, password: newUser.password, role: newUser.role, profilePicture: newUser.profilePicture, phoneNumber: newUser.phoneNumber })
            const refreshToken = await refreshTokenService.refreshNew(newToken, newUser.phoneNumber);

            return res.status(200).json(
                {
                    success: true,
                    message: "Updated password successfully",
                    status: 200,
                    data: {
                        user: {
                            user: newUser.userName,
                            role: newUser.role,
                            profilePicture: newUser.profilePicture
                        },
                        token: newToken,
                        refreshToken
                    }
                }
            )
        }
        catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    }
    async deleteUser(req, res, next) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const user = await tokenService.infoToken(token);

            await refreshTokenService.deleteRefreshToken(token);
            await userModel.findOneAndDelete(user)
            return res.status(201).json({
                success: true,
                message: "Delete Successfully",
                status: 201,
                data: null,
            });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    }
}

const userController = new userHandler();
export default userController;