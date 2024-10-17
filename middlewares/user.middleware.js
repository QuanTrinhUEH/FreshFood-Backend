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
                .pattern(/^[0-9]{10}$/)
                .required()
                .messages({
                    'string.pattern.base': 'Số điện thoại phải có 10 chữ số',
                    'any.required': 'Số điện thoại không được để trống',
                }),
            userName: Joi.string()
                .min(1)
                .max(30)
                .required()
                .messages({
                    'string.min': 'Tên người dùng phải có ít nhất 1 ký tự',
                    'string.max': 'Tên người dùng không được quá 30 ký tự',
                    'any.required': 'Tên người dùng không được để trống',
                }),
            password: Joi.string()
                .min(8)
                .required()
                .messages({
                    'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
                    'any.required': 'Mật khẩu không được để trống',
                }),
        });

        try {
            const existingUser = await userModel.findOne({ $or: [{ phoneNumber }, { userName }] });

            if (existingUser) {
                if (existingUser.phoneNumber === phoneNumber) {
                    throw {
                        message: "Số điện thoại đã tồn tại",
                        status: 400,
                        data: null
                    };
                } else if (existingUser.userName === userName) {
                    throw {
                        message: "Tên người dùng đã tồn tại",
                        status: 400,
                        data: null
                    };
                }
            }

            await schema.validateAsync({
                phoneNumber,
                userName,
                password,
            });

            next();
        }
        catch (e) {
            console.error("Error in register middleware:", e);
            // // delete file if something went wrong
            // if (req.file) {
            //     fs.unlinkSync(`${filePath}\\images\\avatar\\${req.file.filename}`)
            // }
            next(e)
        }
    }

    async login(req, res, next) {
        const { phoneNumber, password } = req.body;
        const schema = Joi.object().keys({
            phoneNumber: Joi.string()
                .pattern(/^[0-9]{10}$/)
                .required()
                .messages({
                    'string.pattern.base': 'Số điện thoại phải có 10 chữ số',
                    'any.required': 'Số điện thoại không được để trống',
                }),
            password: Joi.string()
                .required()
                .messages({
                    'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
                    'any.required': 'Mật khẩu không được để trống',
                }),
        })
        try {
            await schema.validateAsync({
                phoneNumber,
                password,
            })

            // Check if user exists
            const existingUser = await userModel.findOne({ phoneNumber });
            if (!existingUser) {
                throw {
                    message: "Sai tài khoản hoặc mật khẩu",
                    status: 404,
                    data: null
                };
            }
            const decryptedPassword = kryptoService.decrypt(password, existingUser.salt)

            if (existingUser.password != decryptedPassword) {
                throw {
                    message: "Sai tài khoản hoặc mật khẩu",
                    statusCode: 403,
                    data: null
                }
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
                    'any.required': 'Tên người dùng không được để trống',
                }),
        })
        try {
            if (!req.headers.authorization) {
                throw { message: 'No credentials sent!', status: 403, data: null };
            }

            const token = req.headers.authorization.split(' ')[1] || undefined

            tokenService.verifyToken(token);

            await schema.validateAsync({ userName })

            // Check if userName is already taken
            const existingUser = await userModel.findOne({ userName });
            if (existingUser) {
                throw {
                    message: "userName already taken",
                    status: 400,
                    data: null
                };
            }

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
            // password: Joi.string()
            //     .required(),
            newPassword: Joi.string()
                .required()
                .messages({
                    'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
                    'any.required': 'Mật khẩu không được để trống',
                }),
        })
        try {
            if (!req.headers.authorization) {
                throw { message: 'No credentials sent!', status: 403, data: null };
            }
            const token = req.headers.authorization.split(' ')[1];

            tokenService.verifyToken(token);

            const user = await tokenService.infoToken(token);

            const decryptedPassword = kryptoService.decrypt(password, user.salt)

            if (user.password != decryptedPassword) {
                throw {
                    message: "Incorrect password",
                    status: 403,
                    data: null
                }
            }
            await schema.validateAsync({
                // password,
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
                throw { message: 'No credentials sent!', status: 403, data: null };
            }
            const token = req.headers.authorization.split(' ')[1];

            tokenService.verifyToken(token);

            const user = await tokenService.infoToken(token);

            const decryptedPassword = kryptoService.decrypt(password, user.salt)

            if (user.password != decryptedPassword) {
                throw {
                    message: "Incorrect password",
                    status: 403,
                    data: null
                }
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