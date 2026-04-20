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

    const steamUpload = (fileBuffer: Buffer) => {
      return new Promise<string>((resolve, reject) => {
        const steam = cloudinary.uploader.upload_stream(
          { folder: "cosycraft-product-images" },
          (error, result) => {
            if (error || !result)
              return reject(error || new Error("Upload failed"));
            resolve(result.secure_url);
          },
        );

        steam.end(fileBuffer);
      });
    };

    const imageUrl = await steamUpload(req.file.buffer);

    res
      .status(200)
      .json({ success: true, message: "Image upload success", url: imageUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default uploadImage;
