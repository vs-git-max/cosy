import type { Request, Response } from "express";
import { db } from "../../../lib/db";
import { blogs } from "../../../db/schema";
import { eq } from "drizzle-orm";

const fetchUserBlogDetails = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params as {
      blogId: string;
    };

    if (!blogId) {
      return res.status(401).json({
        message: "Add the blogId",
      });
    }

    // 🔍 fetch single blog
    const result = await db
      .select()
      .from(blogs)
      .where(eq(blogs.id, blogId))
      .limit(1);

    const blog = result[0];

    // ❌ not found handling (Drizzle way)
    if (!blog) {
      return res.status(404).json({
        message: "Blog with the id not found",
      });
    }

    return res.status(200).json({
      blog,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default fetchUserBlogDetails;
