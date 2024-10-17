import { Router } from "express"
import billingMiddleware from "../middlewares/billing.middleware.js";
import billingController from "../controllers/billing.controller.js";

const billingRoute = Router();

billingRoute.post('/request', (req, res) => {
    res.send('as')
})

export default billingRoute