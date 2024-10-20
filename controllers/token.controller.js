import tokenService from "../service/token.service.js";

export const tokenController = async (req, res, next) => {
    try {
        const refreshToken = req.headers.authorization.split(' ')[1];
        if (!req.headers.authorization || !refreshToken) {
            throw (
                { message: 'No credentials sent!', status: 403, data: null }
            );
        }
        const [owner, tokenDB] = await refreshTokenService.Validate(refreshToken);
        const newToken = tokenService.signToken({ username: owner.username, password: owner.password, role: owner.ROLE, profile_picture: owner.profile_picture, id: owner.GLOBAL_ID })
        const newRT = await refreshTokenService.refreshNew(newToken, owner.GLOBAL_ID)

        return res.status(200).json(
            {
                success: true,
                message: "Successfully refresh token",
                status: 200,
                data: {
                    user: {
                        username: owner.username,
                        role: owner.ROLE,
                        profile_picture: owner.profile_picture,
                    },
                    token: newToken,
                    refreshToken: newRT
                }
            }
        )
    }
    catch(e) {
        next(e)
    }
}