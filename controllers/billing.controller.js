class billingHandler {
    async confirmUnique(req, res, next) {
        res.status(200).json({
            message: "Successfully made a new bill",
            status: 200,
            data: null
        })
    }
}

const billingController = new billingHandler();
export default billingController;