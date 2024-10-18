import { Router } from "express"
import { imageService } from "../service/image.service.js";
import userController from "../controllers/user.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";

const userRouter = Router()

userRouter.post('/register', userMiddleware.register, userController.register)
userRouter.post('/login', userMiddleware.login, userController.login)
userRouter.put('/update/profile', imageService.saveSingleImg('avatar'), userMiddleware.updateProfile, userController.updateProfile)
userRouter.put('/update/password', userMiddleware.updatePassword, userController.updatePassword)
userRouter.delete('/delete', userMiddleware.deleteUser, userController.deleteUser)

export default userRouter