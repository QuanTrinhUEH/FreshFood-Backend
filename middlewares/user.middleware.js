import fs from 'fs'
import Joi from "joi";
import { userModel } from "../models/user.model.js";
import kryptoService from '../utils/hashing.js';
import tokenService from '../service/token.service.js';

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
            const decryptedPassword = kryptoService.decrypt(password, existedUser.salt)

            if (existedUser.password != decryptedPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Sai tài khoản hoặc mật khẩu",
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
    async updateProfile(req, res, next) {
        const { userName } = req.body
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
        })
        try {
            if (!req.headers.authorization) {
                return res.status(400).json({
                    success: false,
                    message: 'No credentials sent!',
                    status: 403,
                    data: null
                });
            }

            const token = req.headers.authorization.split(' ')[1] || undefined

            tokenService.verifyToken(token);

            await schema.validateAsync({
                userName
            })
            next()
        }
        catch (e) {
            if (req.file) {
                fs.unlinkSync(`${filePath}\\images\\avatar\\${req.file.filename}`)
            }
            next(e)
        }
    }
    async updatePassword(req, res, next) {
        const { password, newPassword } = req.body
        const schema = Joi.object().keys({
            newPassword: Joi.string()
                .min(8)
                .required()
                .messages({
                    'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
                    'any.required': 'Mật khẩu không được để trống'
                }),
        })
        try {
            if (!req.headers.authorization) {
                return res.status(400).json({
                    success: false,
                    message: 'No credentials sent!',
                    status: 403,
                    data: null
                });
            }
            const token = req.headers.authorization.split(' ')[1];

            tokenService.verifyToken(token);

            const user = await tokenService.infoToken(token);

            const decryptedPassword = kryptoService.decrypt(password, user.salt)

            if (user.password != decryptedPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Sai mật khẩu",
                    status: 403,
                    data: null
                });
            }
            await schema.validateAsync({
                newPassword
            })
            next()
        }
        catch (e) {
            next(e)
        }
    }
    async deleteUser(req, res, next) {
        const { password } = req.body;
        try {
            if (!req.headers.authorization) {
                return res.status(400).json({
                    success: false,
                    message: 'No credentials sent!',
                    status: 403,
                    data: null
                });
            }
            const token = req.headers.authorization.split(' ')[1];

            tokenService.verifyToken(token);

            const user = await tokenService.infoTokenTest(token);

            const decryptedPassword = kryptoService.decrypt(password, user.salt)

            if (user.password != decryptedPassword) {
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