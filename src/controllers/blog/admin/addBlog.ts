import type { Request, Response } from "express";
import { db } from "../../../lib/db";
import { blogs } from "../../../db/schema";
import { eq } from "drizzle-orm";

const addBlog = async (req: Request, res: Response) => {
  try {
    const { blogPhoto, shortText, text, title } = req.body as {
      blogPhoto: string;
      title: string;
      shortText: string;
      text: string;
    };

    // 🔍 validate fields
    if (
      [title, blogPhoto, shortText, text].some(
        (item) => !item || item.trim() === "",
      )
    ) {
      return res.status(403).json({
        message: "Please add all the fields",
      });
    }

    // 🔍 check if blog exists
    const existingBlog = await db
      .select()
      .from(blogs)
      .where(eq(blogs.title, title))
      .limit(1);

    if (existingBlog.length > 0) {
      return res.status(403).json({
        message: "Blog with the title already exists",
      });
    }

    // 📝 create blog
    await db.insert(blogs).values({
      title,
      blogPhoto,
      shortText,
      text,
    });

    return res.status(200).json({
      message: "Blog added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default addBlog;
