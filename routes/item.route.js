import { Router } from "express"
import { imageService } from "../service/image.service.js";
import itemMiddleware from "../middlewares/item.middleware.js";
import itemController from "../controllers/item.controller.js";

const itemRouter = Router();

itemRouter.get('/getAll/:p', itemController.getAllItems) // done
itemRouter.get('/getType/:type', itemController.getItemType) // done
itemRouter.get('/getType/:type/:p', itemController.getItemType) // done
itemRouter.get('/searchItem/:name', itemController.searchItem) // done
itemRouter.get('/getItem/:id', itemController.getItem) // done
itemRouter.post('/create', imageService.saveMultipleImg('items'), itemMiddleware.createItem, itemController.createItem) //done
itemRouter.put('/update/:id', itemMiddleware.updateItem, itemController.updateItem) //done
itemRouter.delete('/delete/:id', itemMiddleware.deleteItem, itemController.deleteItem) // done

export default itemRouter