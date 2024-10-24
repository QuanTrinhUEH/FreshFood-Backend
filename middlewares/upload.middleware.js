export const checkFileLimit = (limit) => (req, res, next) => {
    if (req.files && req.files.length > limit) {
        return res.status(400).json({
            success: false,
            message: `Số lượng ảnh không được vượt quá ${limit}`,
            status: 400,
            data: null
        });
    }
    next();
};
