import mongoose from "mongoose";
import { feedbackModel } from "../models/feedback.model.js";

class FeedbackService {
    async submitFeedback({ userId, feedback }) {
        const newFeedback = await feedbackModel.create({ user: userId, feedback });
        return newFeedback;
    }
    async getAllFeedback(filter, page, pageSize) {
        const skip = (page - 1) * pageSize;
        const results = await feedbackModel.aggregate([
            { $match: filter },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    feedback: [
                        { $skip: skip },
                        { $limit: pageSize },
                        {
                            $project: {
                                _id: 1,
                                feedback: 1,
                                status: 1,
                                userName: "$userDetails.userName",
                                createdAt: 1,
                                updatedAt: 1
                            }
                        }
                    ]
                }
            }
        ]);
        const totalFeedbacksCount = results[0].totalCount[0]
            ? results[0].totalCount[0].count
            : 0;
        const feedbacks = results[0].feedback;

        return { feedbacks, totalFeedbacksCount };
    }
    async getFeedBack(feedbackId) {
        const feedback = await feedbackModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(feedbackId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    feedback: 1,
                    status: 1,
                    user: {
                        userName: "$userDetails.userName",
                        phoneNumber: "$userDetails.phoneNumber",
                    },
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);
        return feedback;
    }
    async updateFeedbackStatus(id, status) {
        try {
            const updatedFeedback = await feedbackModel.findByIdAndUpdate(id, { status }, { new: true });
            return updatedFeedback;
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

}

const feedbackService = new FeedbackService();
export default feedbackService;