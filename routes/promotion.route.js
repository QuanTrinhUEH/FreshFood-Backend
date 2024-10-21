import { Router } from "express";
import promotionController from "../controllers/promotion.controller.js";
import promotionMiddleware from "../middlewares/promotion.middleware.js";
import { authentication, authorization } from "../middlewares/auth.middleware.js";

const promotionRouter = Router();

promotionRouter.post('/', authentication, authorization("admin"), promotionMiddleware.createPromotion, promotionController.createPromotion);
promotionRouter.get('/', promotionController.getPromotions);
promotionRouter.patch('/:id', authentication, authorization("admin"), promotionMiddleware.updatePromotion, promotionController.updatePromotion);
promotionRouter.get('/:id', promotionController.getPromotion);

export default promotionRouter;
