import type { Request, Response } from "express";
import { db } from "../../../lib/db";
import { blogs } from "../../../db/schema";
import { eq } from "drizzle-orm";

const editBlog = async (req: Request, res: Response) => {
  try {
    const { blogPhoto, shortText, text, blogId, title } = req.body as {
      blogPhoto?: string;
      shortText?: string;
      text?: string;
      blogId: string;
      title?: string;
    };

    // 🧱 build update object dynamically
    const newUpdatedData: any = {
      ...(blogPhoto !== undefined && { blogPhoto }),
      ...(shortText !== undefined && { shortText }),
      ...(text !== undefined && { text }),
      ...(title !== undefined && { title }),
    };

    // ❌ nothing to update
    if (Object.keys(newUpdatedData).length === 0) {
      return res.status(400).json({
        message: "No new update fields provided",
      });
    }

    // 🔄 update blog
    const updated = await db
      .update(blogs)
      .set(newUpdatedData)
      .where(eq(blogs.id, blogId))
      .returning();

    // 🔍 check if blog existed
    if (updated.length === 0) {
      return res.status(404).json({
        message: "Blog with the id not found",
      });
    }

    return res.status(200).json({
      message: "Blog updated...",
      data: updated[0],
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default editBlog;
