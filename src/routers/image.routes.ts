import { Router } from "express";
import { upload } from "../middleware/upload";
import uploadImage from "../controllers/products/image/image-upload-controller";

const imageUploadRoute = Router();

imageUploadRoute.post("/upload", upload.single("file"), uploadImage);

export default imageUploadRoute;
