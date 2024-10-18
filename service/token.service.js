import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
import { config } from "dotenv";
config();


class tokenHandler {
  signToken(payload) {
    try {
      const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
        expiresIn: "5m",
        algorithm: "HS256",
        header: {
          typ: "jwt"
        }
      });
      return (token)
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
  verifyToken(token) {
    try {
      jwt.verify(token, process.env.JWT_PRIVATE_KEY)
      return true
    }
    catch (e) {
      throw (
        {
          message: "Invalid token",
          status: 403,
          data: null
        }
      )
    }
  }
  async infoToken(token) {
    const user = await userModel.findOne({ password: jwt.decode(token).password })
    if (!user) {
      throw (
        {
          message: "User does not exist",
          status: 404,
          data: null
        }
      )
    }
    else {
      return user
    }
  }
  async infoTokenTest(token) {
    const user = await userModel.findOne({ GLOBAL_ID: jwt.decode(token).id });
    if (!user) {
      throw (
        {
          message: "User does not exist",
          status: 404,
          data: null
        }
      )
    } else {
      return user;
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