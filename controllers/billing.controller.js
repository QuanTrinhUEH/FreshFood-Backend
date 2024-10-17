class billingHandler {
    async confirmUnique(req, res, next) {
        try {
            const { orderId } = req.body
            const order = await orderService.getOrderById(orderId)
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found",
                    status: 404,
                    data: null
                })
            }
            const billing = await billingService.createBilling(order)
            return res.status(200).json({
                success: true,
                message: "Successfully made a new bill",
                status: 200,
                data: billing
            })
        } catch (error) {
            next(error)
        }
    }
}

const billingController = new billingHandler();
export default billingController;