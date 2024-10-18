import { Router } from "express";
import promotionController from "../controllers/promotion.controller.js";
import promotionMiddleware from "../middlewares/promotion.middleware.js";

const promotionRouter = Router();

promotionRouter.post('/create', promotionMiddleware.createPromotion, promotionController.createPromotion);
promotionRouter.get('/get-all', promotionController.getAllPromotions);
promotionRouter.get('/get/:id', promotionController.getPromotion);
promotionRouter.put('/update/:id', promotionMiddleware.updatePromotion, promotionController.updatePromotion);
promotionRouter.delete('/delete/:id', promotionMiddleware.deletePromotion, promotionController.deletePromotion);
promotionRouter.post('/add-item/:promotionId/:itemId', promotionController.addItemToPromotion);
promotionRouter.delete('/remove-item/:promotionId/:itemId', promotionController.removeItemFromPromotion);

export default promotionRouter;
