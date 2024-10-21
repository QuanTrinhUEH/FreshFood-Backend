import tokenService from '../service/token.service.js';


export const authentication = async (req, res, next) => {
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
export const authorization = (requiredRole) => async (req, res, next) => {
    try {
        const permissions = req.user.role;

        if (permissions !== requiredRole) {
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