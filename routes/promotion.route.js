import { Router } from "express";
import promotionController from "../controllers/promotion.controller.js";
import promotionMiddleware from "../middlewares/promotion.middleware.js";
import { authentication, authorization } from "../middlewares/auth.middleware.js";

const promotionRouter = Router();

promotionRouter.post('/', authentication, authorization("admin"), promotionMiddleware.createPromotion, promotionController.createPromotion);
promotionRouter.patch('/:id', authentication, authorization("admin"), promotionMiddleware.updatePromotion, promotionController.updatePromotion);
promotionRouter.get('/', authentication, authorization("admin"), promotionMiddleware.getPromotions, promotionController.getPromotions);
promotionRouter.get('/:id', authentication, authorization("admin"), promotionMiddleware.getPromotion, promotionController.getPromotion);

export default promotionRouter;
