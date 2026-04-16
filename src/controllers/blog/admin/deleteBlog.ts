import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params as {
      blogId: string;
    };
    if (!blogId)
      return res.status(401).json({ message: "Pass the blogId to delete" });

    await prisma.blog.delete({
      where: {
        id: blogId,
      },
    });
  } catch (error: any) {
    console.log(error);

    if (error?.code === "P2025") {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default deleteBlog;
