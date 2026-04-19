import type { Request, Response } from "express";
import { db } from "../../../lib/db";
import { blogs } from "../../../db/schema";
import { eq } from "drizzle-orm";

const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params as {
      blogId: string;
    };

    if (!blogId) {
      return res.status(401).json({
        message: "Pass the blogId to delete",
      });
    }

    // 🗑️ delete blog
    const deleted = await db
      .delete(blogs)
      .where(eq(blogs.id, blogId))
      .returning();

    // 🔍 check if anything was deleted
    if (deleted.length === 0) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default deleteBlog;
