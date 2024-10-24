import tokenService from "../service/token.service.js";

export const tokenMiddleware = async (req, res, next) => {
    try {
        const refreshToken = req.headers.authorization.split(' ')[1];
        const data = await tokenService.verifyToken(refreshToken);
        if(!data) {
            throw(
                {
                    message: "Unexpected error",
                    status: 500,
                    data: null
                }
            )
        }
        next()
    }
    catch(e) {
        next(e)
    }
}