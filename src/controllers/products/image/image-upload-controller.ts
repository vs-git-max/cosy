import type { Request, Response } from "express";
import cloudinary from "../../../config/cloudinary";

const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed",
      });
    }

    const streamUpload = (fileBuffer: Buffer) => {
      return new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "cosycraft-product-images" },
          (error, result) => {
            if (error || !result) {
              return reject(error || new Error("Upload failed"));
            }
            resolve(result.secure_url);
          },
        );

        stream.end(fileBuffer);
      });
    };

    const imageUrl = await streamUpload(req.file.buffer);

    res.status(200).json({
      success: true,
      message: "Image upload success",
      url: imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default uploadImage;
