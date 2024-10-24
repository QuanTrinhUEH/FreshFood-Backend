import { Router } from "express";
import userController from "../controllers/user.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";
import { authentication } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.post('/register', userMiddleware.register, userController.register)
userRouter.post('/login', userMiddleware.login, userController.login)
userRouter.put('/profile/:id', authentication, userMiddleware.updateProfile, userController.updateProfile)
userRouter.put('/password/:id', authentication, userMiddleware.updatePassword, userController.updatePassword)
userRouter.get('/me', authentication, userController.getCurrentUser)

export default userRouter
