import { Router } from "express";
import userController from "../controllers/user.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.post('/register', userMiddleware.register, userController.register)
userRouter.post('/login', userMiddleware.login, userController.login)
userRouter.put('/profile/:id', authMiddleware.authentication, userMiddleware.updateProfile, userController.updateProfile)
userRouter.put('/password/:id', authMiddleware.authentication, userMiddleware.updatePassword, userController.updatePassword)
userRouter.get('/me', authMiddleware.authentication, userController.getCurrentUser)

export default userRouter
