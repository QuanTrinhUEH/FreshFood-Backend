import jwt from "jsonwebtoken";
import { tokenModel } from "../models/token.model.js";
import { userModel } from "../models/user.model.js";
import { config } from "dotenv";
import tokenService from "./token.service.js";
config();

class refreshTokenHandler {
    async createNew(token, phoneNumber) {
        try {
            const owner = await userModel.findOne({ phoneNumber })
            const refreshToken = jwt.sign({ token }, process.env.JWT_PRIVATE_KEY, {
                expiresIn: "7d",
                algorithm: "HS256",
                header: {
                    typ: "jwt"
                }
            })
            await tokenModel.create({
                owner,
                refreshToken,
                used: false,
            })
            return refreshToken
        } catch (e) {
            throw {
                message: e.message || e,
                status: 500,
                data: null
            }
        }
    }
    async refreshNew(token, phoneNumber) {
        try {
            const owner = await userModel.findOne({ phoneNumber })
            const refreshToken = jwt.sign({ token }, process.env.JWT_PRIVATE_KEY, {
                expiresIn: "7d",
                algorithm: "HS256",
                header: {
                    typ: "jwt"
                }
            })
            await tokenModel.findOneAndUpdate({ owner }, { refreshToken, used: false }, { new: true })

            return refreshToken
        }
        catch (e) {
            throw (
                {
                    message: e.message || e,
                    status: 500,
                    data: null
                }
            )
        }
    }
    async Validate(RT) {
        try {
            tokenService.verifyToken(RT);
            const token = jwt.decode(RT).token;
            const owner = await tokenService.infoToken(token)
            const tokenDB = await tokenModel.findOne({ owner })
            if (!tokenDB || tokenDB.refreshToken != RT) {
                throw {
                    message: "Token does not exist or invalid",
                    status: 403,
                    data: null
                }
            }
            return [owner, tokenDB]
        }
        catch (e) {
            throw {
                message: e.message,
                status: e.status,
                data: null
            }
        }
    }
    async deleteRefreshToken(token) {
        try {
            const user = await userModel.findOne({ phoneNumber: jwt.decode(token).phoneNumber });
            if (!user) {
                throw (
                    {
                        message: "User does not exist",
                        status: 404,
                        data: null
                    }
                )
            }
            return await tokenModel.findOneAndDelete({ owner: user });
        } catch (e) {
            throw ({
                message: e.message || e,
                status: 500,
                data: null
            })
        }
    }
}

const refreshTokenService = new refreshTokenHandler();
export default refreshTokenService