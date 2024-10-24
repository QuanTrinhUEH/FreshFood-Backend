import { Router } from "express"
import { tokenMiddleware } from "../middlewares/token.middleware.js";
import { tokenController } from "../controllers/token.controller.js";

const tokenRequest = Router();

tokenRequest.post('/request', tokenMiddleware, tokenController)

export default tokenRequest