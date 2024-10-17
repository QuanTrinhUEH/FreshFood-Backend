import { billingModel } from "../models/billing.model.js";

class billingHandler {
    async checkUnique(req, res, next) {
        try {
            const id = req.params.id;
            const existedBill = await billingModel.findOne({ ID: id })
            if (existedBill) {
                throw ({
                    message: "Existed an identical bill",
                    status: 403,
                    data: null
                })
            }
            next()
        }
        catch (e) {
            next(e)
        }
    }
}

const billingMiddleware = new billingHandler();
export default billingMiddleware