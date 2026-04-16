import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

const editBlog = async (req: Request, res: Response) => {
  try {
    const { blogPhoto, shortText, text, blogId, title } = req.body as {
      blogPhoto?: string;
      shortText?: string;
      text?: string;
      blogId: string;
      title?: string;
    };

    const newUpdatedData = {
      ...(blogPhoto !== undefined && { blogPhoto }),
      ...(shortText !== undefined && { shortText }),
      ...(text !== undefined && { text }),
      ...(title !== undefined && { title }),
    };

    if (Object.keys(newUpdatedData).length === 0) {
      return res.status(400).json({
        message: "No new update fields provided",
      });
    }

    await prisma.blog.update({
      where: {
        id: blogId,
      },
      data: newUpdatedData,
    });

    return res.status(200).json({
      message: "Blog updated...",
    });
  } catch (error: any) {
    console.log(error);

    if (error?.code === "P2025") {
      return res.status(404).json({
        message: "Blog with the id not found",
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

export default editBlog;
