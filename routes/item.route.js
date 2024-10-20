import { Router } from "express"
import imageService from "../service/image.service.js";
import itemMiddleware from "../middlewares/item.middleware.js";
import itemController from "../controllers/item.controller.js";

const itemRouter = Router();

// TODO: FINISH ALL OF THIS TODAY

// itemRouter.get('/search-item/:name', itemController.searchItem) // done
itemRouter.get('/:id', itemController.getItem) // done
itemRouter.post('/create', /*imageService.saveMultipleImg('items'),*/ itemMiddleware.createItem, itemController.createItem) //done
itemRouter.put('/:id', itemMiddleware.updateItem, itemController.updateItem) //done
itemRouter.delete('/:id', itemMiddleware.deleteItem, itemController.deleteItem) // done
itemRouter.get('/', itemMiddleware.getItemsAdmin, itemController.getItemsAdmin);
itemRouter.get('/type/:type', itemController.getItemType)

export default itemRouter