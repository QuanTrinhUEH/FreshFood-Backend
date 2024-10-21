import express from "express";
import { uploadImage, uploadMultipleImages } from "../controllers/upload.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Route for single image upload
router.post("/", upload.single("image"), uploadImage);

// New route for multiple image upload
router.post("/multiple", upload.array("images", 5), uploadMultipleImages);

export default router;
