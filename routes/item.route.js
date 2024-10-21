import { Router } from "express"
import itemMiddleware from "../middlewares/item.middleware.js";
import itemController from "../controllers/item.controller.js";
import { authentication, authorization } from "../middlewares/auth.middleware.js";

const itemRouter = Router();


itemRouter.post('/', authentication, authorization("admin"), itemMiddleware.createItem, itemController.createItem);
itemRouter.patch('/:id', authentication, authorization("admin"), itemMiddleware.updateItem, itemController.updateItem);
itemRouter.get('/management', authentication, authorization("admin"), itemMiddleware.getItemsAdmin, itemController.getItemsAdmin);
itemRouter.get('/', itemMiddleware.getItems, itemController.getItems);
itemRouter.get('/:id', itemController.getItem);

export default itemRouter