import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model.js';
import tokenService from '../service/token.service.js';

class AuthMiddleware {
    // async authentication(req, res, next) {
    //     try {
    //         const token = req.headers.authorization?.split(' ')[1];

    //         if (!token) {
    //             return res.status(401).json({
    //                 message: "No token provided",
    //                 status: 401,
    //                 data: null
    //             });
    //         }

    //         const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    //         const user = await userModel.findById(decoded.id).select('-password');

    //         if (!user) {
    //             return res.status(404).json({
    //                 message: "User not found",
    //                 status: 404,
    //                 data: null
    //             });
    //         }

    //         req.user = user;
    //         next();
    //     } catch (error) {
    //         if (error instanceof jwt.JsonWebTokenError) {
    //             return res.status(401).json({
    //                 message: "Invalid token",
    //                 status: 401,
    //                 data: null
    //             });
    //         }
    //         next(error);
    //     }
    // }

    async authentication(req, res, next) {
        try {
            if (!req.headers.authorization) {
                return res.status(403).json({
                    message: "Không có thông tin xác thực",
                    status: 403,
                    error: "Unauthorized"
                });
            }

            const token = req.headers.authorization.split(" ")[1];
            tokenService.verifyToken(token);
            req.user = await tokenService.infoToken(token);

            next();
        } catch (error) {
            return res.status(403).json({
                message: "Token không hợp lệ",
                status: 403,
                error: "Unauthorized",
                details: error.message
            });
        }
    };
    async authorization(req, res, next) {
        try {
            const permissions = req.user.role;

            if (permissions === 'user') {
                return res.status(403).json({
                    message: "Không có quyền truy cập",
                    status: 403,
                    error: "Forbidden"
                });
            }

            next();
        } catch (error) {
            return res.status(403).json({
                message: "Lỗi xác thực",
                status: 403,
                error: "Forbidden",
                details: error.message
            });
        }
    }
}

const authMiddleware = new AuthMiddleware();
export default authMiddleware;

