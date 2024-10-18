import { Router } from "express"
import { imageService } from "../service/image.service.js";
import itemMiddleware from "../middlewares/item.middleware.js";
import itemController from "../controllers/item.controller.js";

const itemRouter = Router();

// TODO: FINISH ALL OF THIS TODAY

itemRouter.get('/get-all/:p', itemController.getAllItems) // done
itemRouter.get('/get-type/:type', itemController.getItemType) // done
itemRouter.get('/get-type/:type/:p', itemController.getItemType) // done
itemRouter.get('/search-item/:name', itemController.searchItem) // done
itemRouter.get('/get-item/:id', itemController.getItem) // done
itemRouter.post('/create', imageService.saveMultipleImg('items'), itemMiddleware.createItem, itemController.createItem) //done
itemRouter.put('/update/:id', itemMiddleware.updateItem, itemController.updateItem) //done
itemRouter.delete('/delete/:id', itemMiddleware.deleteItem, itemController.deleteItem) // done

export default itemRouter