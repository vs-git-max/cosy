import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

const addBlog = async (req: Request, res: Response) => {
  try {
    const { blogPhoto, shortText, text, title } = req.body as {
      blogPhoto: string;
      title: string;
      shortText: string;
      text: string;
    };

    if (
      [title, blogPhoto, shortText, text].some(
        (item) => !item || item.trim() === "",
      )
    )
      return res.status(403).json({
        message: "Please add all the fields",
      });

    const isBlog = await prisma.blog.findUnique({
      where: {
        title,
      },
    });

    if (isBlog)
      return res.status(403).json({
        message: "Blog with the title already exists",
      });

    await prisma.blog.create({
      data: {
        title,
        blogPhoto,
        shortText,
        text,
      },
    });

    return res.status(200).json({
      message: "Blog added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default addBlog;
