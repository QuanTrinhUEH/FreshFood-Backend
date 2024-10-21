import imageService from "../service/image.service.js";

export const uploadImage = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "File is required",
                status: 400,
                data: null,
            });
        }

        const fileUrl = await imageService.uploadImageToCloudinary(file);
        res.status(200).json({
            success: true,
            message: "Upload image successfully",
            status: 200,
            data: {
                fileUrl
            }
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error",
            status: error.status || 500,
            data: error.data || null,
        });
    }
};

export const uploadMultipleImages = async (req, res) => {
    try {
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files were uploaded",
                status: 400,
                data: null,
            });
        }

        const uploadPromises = files.map(file => imageService.uploadImageToCloudinary(file));
        const fileUrls = await Promise.all(uploadPromises);

        res.status(200).json({
            success: true,
            message: "Upload images successfully",
            status: 200,
            data: {
                fileUrls
            }
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error",
            status: error.status || 500,
            data: error.data || null,
        });
    }
};
