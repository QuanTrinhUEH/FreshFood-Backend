import feedbackService from "../service/feedback.service.js";
class feedbackHandler {
  async submitFeedback(req, res, next) {
    try {
      const { feedback } = req.body;
      const userId = req.user.id;

      const newFeedback = await feedbackService.submitFeedback({ userId, feedback });

      res.status(201).json({
        message: "Feedback submitted successfully",
        status: 201,
        data: { feedback: newFeedback }
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal server error",
        status: error.status || 500,
        data: error.data || null
      });
    }
  }

  async getAllFeedback(req, res, next) {
    try {
      const { search = "", page = 1, pageSize = 10 } = req.query;
      const maxPageSize = 100;
      const limitedPageSize = Math.min(pageSize, maxPageSize);
      const filters = search
        ? {
          $or: [
            { phoneNumber: { $regex: search, $options: "i" } },
          ]
        } : {};

      const { feedbacks, totalFeedbacksCount } = await feedbackService.getAllFeedback(filters, page, limitedPageSize);
      return res.status(200).json({
        success: true,
        message: "Lấy danh sách phản hồi thành công",
        data: {
          feedbacks,
          totalPages: Math.ceil(totalFeedbacksCount / limitedPageSize),
          totalCount: totalFeedbacksCount,
          currentPage: Number(page)
        },
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal server error",
        status: error.status || 500,
        data: error.data || null
      });
    }
  }

  async getFeedbackById(req, res, next) {
    try {
      const feedback = await feedbackService.getFeedBack(req.params.id);
      if (!feedback) {
        return res.status(404).json({
          message: "Phản hồi không tồn tại",
          status: 404,
          data: null
        });
      }
      res.status(200).json({
        message: "Lấy thông tin phản hồi thành công",
        status: 200,
        data: { feedback }
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal server error",
        status: error.status || 500,
        data: error.data || null
      });
    }
  }

  async updateFeedbackStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedFeedback = await feedbackService.updateFeedbackStatus(id, status)
      if (!updatedFeedback) {
        return res.status(404).json({
          message: 'Phản hồi không tồn tại',
          status: 404,
          data: null
        });
      }

      res.status(200).json({
        message: 'Cập nhật trạng thái phản hồi thành công',
        status: 200,
        data: { feedback: updatedFeedback }
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal server error",
        status: error.status || 500,
        data: error.data || null
      });
    }
  }

}

const feedbackController = new feedbackHandler();
export default feedbackController;

