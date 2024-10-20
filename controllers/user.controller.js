import fs from 'fs'
import cloudinaryService from '../service/cloudinary.service.js';
import encodeService from '../utils/hashing.js';
import userService from '../service/user.service.js';
import tokenService from '../service/token.service.js';
import { userModel } from '../models/user.model.js';



const filePath = fs.realpathSync('./')

class UserHandler {
    async register(req, res, next) {
        try {
            const { phoneNumber, userName, password } = req.body;

            // encrypt password, salt and save in database
            const [newPassword, salt] = encodeService.encrypt(password)

            // save information of user in database, with new password as encrypted and their salt
            const newUser = await userService.register(phoneNumber, userName, newPassword, salt)

            // create token and refresh token with new user as payload
            const token = tokenService.signAccessToken({ userName: newUser.userName, password: newUser.password, phoneNumber: newUser.phoneNumber });
            const refreshToken = await tokenService.signRefreshToken({ phoneNumber: newUser.phoneNumber });

            return res.status(201).json({
                success: true,
                message: "Register Successfully",
                status: 201,
                data: {
                    user: {
                        userName: newUser.userName,
                        role: newUser.role,
                        profileImage: newUser.profileImage,
                    },
                    token,
                    refreshToken,
                },
            });
        }
        catch (e) {
            next(e)
        }
    };
    async login(req, res, next) {
        try {
            const user = req.user;
            const token = tokenService.signAccessToken({ phoneNumber: user.phoneNumber, password: user.password })
            const refreshToken = await tokenService.signRefreshToken({ phoneNumber: user.phoneNumber });

            return res.status(200).json({
                success: true,
                message: "Login Successfully",
                status: 200,
                data: {
                    user: {
                        userName: user.userName,
                        role: user.role,
                        profileImage: user.profileImage,
                    },
                    token,
                    refreshToken,
                },
            });
        }
        catch (e) {
            next(e)
        }
    }
    async updateProfile(req, res, next) {
        try {
            const id = req.params.id;
            const updateData = req.body;
            // if (req.file) {
            //     const avatarData = await cloudinaryService.postSingleImage(`${filePath}\\${req.file.path}`, avatar)
            //     fs.unlinkSync(`${filePath}\\${req.file.path}`)
            //     avatar = avatarData.url
            // }
            // else {
            //     avatar = false
            // }


            const updatedUser = await userService.updateUser(id, updateData);
            console.log(updatedUser)

            return res.status(201).json({
                success: true,
                message: "Update Successfully",
                status: 201,
                data: {
                    user: {
                        userName: updatedUser.userName,
                        role: updatedUser.role,
                        profileImage: updatedUser.profileImage,
                    }
                },
            });
        } catch (error) {
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
            const user = req.user;
            const { newPassword } = req.body;
            const [updatePassword, updateSalt] = encodeService.encrypt(newPassword);
            const newUser = await userService.updateUser(user._id, { password: updatePassword, salt: updateSalt });

            const newToken = tokenService.signAccessToken({ phoneNumber: newUser.phoneNumber, password: newUser.password });
            const refreshToken = await tokenService.refreshNew(newToken, newUser.phoneNumber);

            return res.status(200).json(
                {
                    success: true,
                    message: "Updated password successfully",
                    status: 200,
                    data: {
                        user: {
                            userName: newUser.userName,
                            role: newUser.role,
                            profileImage: newUser.profileImage
                        },
                        token: newToken,
                        refreshToken
                    }
                }
            )
        } catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    }

    async getCurrentUser(req, res, next) {
        try {
            res.status(200).json({
                message: "Current user retrieved successfully",
                status: 200,
                data: { user: req.user }
            });
        } catch (e) {
            next(e);
        }
    }
}

const userController = new UserHandler();
export default userController;
