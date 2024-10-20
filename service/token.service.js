import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
import { config } from "dotenv";
import { tokenModel } from "../models/token.model.js";
config();


class tokenHandler {
  signAccessToken(payload) {
    try {
      const accessToken = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
        expiresIn: "15m",
        algorithm: "HS256",
        header: {
          typ: "jwt"
        }
      });
      return (accessToken)
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
  };
  async signRefreshToken(payload) {
    try {
      const refreshToken = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
        expiresIn: "7d",
        algorithm: "HS256",
        header: {
          typ: "jwt"
        }
      });

      // Tìm token hiện có của user
      const existingToken = await tokenModel.findOne({ owner: payload.phoneNumber });

      if (existingToken) {
        // Nếu đã có token, cập nhật token mới
        existingToken.refreshToken = refreshToken;
        existingToken.used = false;
        await existingToken.save();
      } else {
        // Nếu chưa có token, tạo mới
        await tokenModel.create({
          owner: payload.phoneNumber,
          refreshToken,
          used: false,
        });
      }

      return refreshToken;
    } catch (e) {
      throw {
        message: e.message || e,
        status: 500,
        data: null
      };
    }
  };
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
  verifyToken(token) {
    try {
      jwt.verify(token, process.env.JWT_PRIVATE_KEY)
      return true
    }
    catch (e) {
      const error = new Error("Invalid token");
      error.status = 403;
      error.data = null;
      throw error;
    }
  };
  async Validate(refreshToken) {
    try {
      jwt.verify(refreshToken, process.env.JWT_PRIVATE_KEY);
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
  async infoToken(token) {
    try {
      const decodedToken = jwt.decode(token);
      if (!decodedToken?.phoneNumber) {
        const error = new Error("Invalid token");
        error.status = 403;
        error.data = null;
        throw error;
      }

      const user = await userModel.findOne({ phoneNumber: decodedToken.phoneNumber }).select('-password -salt');
      if (!user) {
        const error = new Error("User does not exist");
        error.status = 404;
        error.data = null;
        throw error;
      }
      return user;
    } catch (e) {
      const error = new Error(e.message);
      error.status = 500;
      error.data = null;
      throw error;
    }
  }
  // async deleteToken(token) {
  //   try {
  //     const user = jwt.decode(token)
  //     const newID = uuid()
  //     await userModel.findOneAndUpdate({ GLOBAL_ID: user.GLOBAL_ID }, { GLOBAL_ID: newID })
  //     const { username } = await userModel.findOne({ GLOBAL_ID: newID })
  //     if (!username || username === undefined) {
  //       throw new Error("Account does not exist")
  //     } else {
  //       return username
  //     }
  //   } catch (e) {
  //     return e
  //   }
  // }
}
const tokenService = new tokenHandler();

export default tokenService;
