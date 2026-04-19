import type { Request, Response } from "express";
import { db } from "../../../lib/db";
import { blogs } from "../../../db/schema";

const fetchUserBlog = async (_req: Request, res: Response) => {
  try {
    // 📦 fetch all blogs
    const allBlogs = await db.select().from(blogs);

    return res.status(200).json({
      blogs: allBlogs,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default fetchUserBlog;
