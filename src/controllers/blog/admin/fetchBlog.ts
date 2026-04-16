import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

const fetchAdminBlog = async (_req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({});

    return res.status(200).json({
      blogs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default fetchAdminBlog;
