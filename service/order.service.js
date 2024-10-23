import mongoose from "mongoose";
import { orderModel } from "../models/order.model.js";

class OrderService {
    async createOrder(userId, items, totalAmount, address, phoneNumber) {
        const order = new orderModel({
            user: userId,
            items: items.map(item => ({
                item: item.itemId,
                quantity: item.quantity
            })),
            totalAmount,
            address,
            phoneNumber
        });

        const savedOrder = await order.save();
        return savedOrder;
    };
    async updateOrderStatus(id, status) {
        try {
            const updatedOrder = await orderModel.findByIdAndUpdate(id, { status }, { new: true });
            return updatedOrder;
        } catch (e) {
            throw (
                {
                    message: e.message || e,
                    status: 500,
                    data: null
                }
            )
        }
    }
    async cancelOrder(id) {
        try {
            const cancelledOrder = await orderModel.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
            return cancelledOrder;
        } catch (e) {
            throw (
                {
                    message: e.message || e,
                    status: 500,
                    data: null
                }
            )
        }
    }
    async getOrders(filters, page, pageSize) {
        const skip = (page - 1) * pageSize;

        const results = await orderModel.aggregate([
            { $match: filters },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $lookup: {
                    from: "items",
                    localField: "items.item",
                    foreignField: "_id",
                    as: "itemDetails"
                }
            },
            {
                $addFields: {
                    items: {
                        $map: {
                            input: "$items",
                            as: "orderItem",
                            in: {
                                $mergeObjects: [
                                    "$$orderItem",
                                    {
                                        itemDetails: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: "$itemDetails",
                                                        cond: { $eq: ["$$this._id", "$$orderItem.item"] }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    documents: [
                        { $skip: skip },
                        { $limit: pageSize },
                        {
                            $project: {
                                _id: 1,
                                orderId: 1,
                                user: {
                                    _id: 1,
                                    userName: 1,
                                    phoneNumber: 1
                                },
                                items: {
                                    $map: {
                                        input: "$items",
                                        as: "item",
                                        in: {
                                            _id: "$$item._id",
                                            quantity: "$$item.quantity",
                                            itemName: "$$item.itemDetails.itemName",
                                            price: "$$item.itemDetails.price"
                                        }
                                    }
                                },
                                totalAmount: 1,
                                status: 1,
                                createdAt: 1,
                            }
                        }
                    ]
                }
            }
        ]);

        const totalOrdersCount = results[0].totalCount[0]
            ? results[0].totalCount[0].count
            : 0;
        const orders = results[0].documents;

        return { orders, totalOrdersCount };
    }
    async getOrder(orderId) {
        const order = await orderModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(orderId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $lookup: {
                    from: "items",
                    localField: "items.item",
                    foreignField: "_id",
                    as: "itemDetails"
                }
            },
            {
                $addFields: {
                    items: {
                        $map: {
                            input: "$items",
                            as: "orderItem",
                            in: {
                                $mergeObjects: [
                                    "$$orderItem",
                                    {
                                        itemDetails: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: "$itemDetails",
                                                        cond: { $eq: ["$$this._id", "$$orderItem.item"] }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    orderId: 1,
                    user: {
                        _id: 1,
                        userName: 1,
                        phoneNumber: 1
                    },
                    items: {
                        $map: {
                            input: "$items",
                            as: "item",
                            in: {
                                _id: "$$item._id",
                                quantity: "$$item.quantity",
                                itemName: "$$item.itemDetails.itemName",
                                price: "$$item.itemDetails.price"
                            }
                        }
                    },
                    totalAmount: 1,
                    status: 1,
                    address: 1,
                    createdAt: 1,
                }
            }
        ]);

        return order[0];  // Trả về đơn hàng đầu tiên (và duy nhất) trong mảng kết quả
    }
}

const orderService = new OrderService();
export default orderService;
