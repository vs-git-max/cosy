import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

const fetchUserBlogDetails = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params as {
      blogId: string;
    };
    if (!blogId)
      return res.status(401).json({
        message: "Add the blogId",
      });

    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
    });

    return res.status(200).json({
      blog,
    });
  } catch (error: any) {
    console.log(error);

    if (error?.code === "P2025")
      return res.status(404).json({ message: "Blog with the id not found" });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default fetchUserBlogDetails;
