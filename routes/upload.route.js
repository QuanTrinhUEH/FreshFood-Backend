import express from "express";
import { uploadImage, uploadMultipleImages } from "../controllers/upload.controller.js";
import multer from "multer";
import { checkFileLimit } from "../middlewares/upload.middleware.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), uploadImage);
router.post("/multiple", upload.array("images"), checkFileLimit(5), uploadMultipleImages);

export default router;
