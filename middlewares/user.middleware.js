import fs from 'fs'
import Joi from "joi";
import { userModel } from "../models/user.model.js";
import encodeService from '../utils/hashing.js';

const filePath = fs.realpathSync('./')

class userHandler {
    async register(req, res, next) {
        const { phoneNumber, userName, password } = req.body;
        const schema = Joi.object().keys({
            phoneNumber: Joi.string()
                .pattern(new RegExp('^[0-9]{10}$'))
                .required()
                .messages({
                    'string.pattern.base': 'Số điện thoại không hợp lệ',
                    'any.required': 'Số điện thoại không được để trống'
                }),
            userName: Joi.string()
                .min(3)
                .max(30)
                .required()
                .messages({
                    'string.min': 'Tên người dùng phải có ít nhất 3 ký tự',
                    'string.max': 'Tên người dùng không được quá 30 ký tự',
                    'any.required': 'Tên người dùng không được để trống'
                }),

            password: Joi.string()
                .min(8)
                .required()
                .messages({
                    'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
                    'any.required': 'Mật khẩu không được để trống'
                }),
        })

        try {
            const existedUser = await userModel.findOne({ phoneNumber });
            if (existedUser) {
                return res.status(400).json({
                    success: false,
                    message: "Số điện thoại đã tồn tại",
                    status: 403,
                    data: null
                });
            }


            await schema.validateAsync({
                phoneNumber,
                userName,
                password,
            })
            next()
        }
        catch (e) {
            // delete file if something went wrong
            if (req.file) {
                fs.unlinkSync(`${filePath}\\images\\avatar\\${req.file.filename}`)
            }
            next(e)
        }
    }
    async login(req, res, next) {
        const { phoneNumber, password } = req.body;
        const schema = Joi.object().keys({
            phoneNumber: Joi.string()
                .pattern(new RegExp('^[0-9]{10}$'))
                .required()
                .messages({
                    'string.pattern.base': 'Số điện thoại không hợp lệ',
                    'any.required': 'Số điện thoại không được để trống'
                }),
            password: Joi.string()
                .min(8)
                .required()
                .messages({
                    'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
                    'any.required': 'Mật khẩu không được để trống'
                }),
        })
        try {
            await schema.validateAsync({
                phoneNumber,
                password,
            })
            const existedUser = await userModel.findOne({ phoneNumber });
            if (!existedUser) {
                return res.status(400).json({
                    success: false,
                    message: "Sai tài khoản hoặc mật khẩu",
                    status: 403,
                    data: null
                });
            }
            const isPasswordValid = encodeService.decrypt(password, existedUser.password);

            if (!isPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: "Sai tài khoản hoặc mật khẩu",
                    status: 403,
                    data: null
                });
            }

            req.user = existedUser;

            next()
        }
        catch (e) {
            next(e)
        }
    }
    async updateProfile(req, res, next) {
        const { userName, profileImage } = req.body;
        const schema = Joi.object().keys({
            userName: Joi.string()
                .min(3)
                .max(30)
                .required()
                .messages({
                    'string.min': 'Tên người dùng phải có ít nhất 3 ký tự',
                    'string.max': 'Tên người dùng không được quá 30 ký tự',
                    'any.required': 'Tên người dùng không được để trống'
                }),
            profileImage: Joi.string()
                .max(1000)
                .uri()
                .messages({
                    "string.base": "Link ảnh không hợp lệ",
                    "string.max": "Link ảnh không được quá 1000 ký tự",
                    "string.uri": "Link ảnh không hợp lệ",
                }),
        })
        try {
            await schema.validateAsync({
                userName,
                profileImage
            });

            const user = req.user;
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Không có quyền truy cập",
                    status: 403,
                    data: null
                });
            }

            const existedUser = await userModel.findOne({ userName: req.body.userName, _id: { $ne: user._id } });
            if (existedUser) {
                return res.status(400).json({
                    success: false,
                    message: "Tên người dùng đã tồn tại",
                    status: 403,
                    data: null
                });
            }
            next()
        }
        catch (e) {
            next(e);
        }
    }
    async updatePassword(req, res, next) {
        const { password, newPassword } = req.body
        const schema = Joi.object().keys({
            password: Joi.string()
                .min(8)
                .required()
                .messages({
                    'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
                    'any.required': 'Mật khẩu không được để trống'
                }),
            newPassword: Joi.string()
                .min(8)
                .required()
                .messages({
                    'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
                    'any.required': 'Mật khẩu không được để trống'
                }),
        })
        try {
            await schema.validateAsync({
                password,
                newPassword
            })

            const user = await userModel.findById(req.params.id);

            const isPasswordValid = encodeService.decrypt(password, user.password);

            if (!isPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: "Sai mật khẩu",
                    status: 403,
                    data: null
                });
            }
            next()
        }
        catch (e) {
            next(e)
        }
    }
}
const userMiddleware = new userHandler();
export default userMiddleware;
