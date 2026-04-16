import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export interface AuthCartParams extends Request {
  user?: {
    id: string;
  };
}

const addToCart = async (req: AuthCartParams, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(403).json({
        success: false,
        message: "Unauthorized...",
      });

    const { productId } = req.body;
    if (!productId)
      return res.status(400).json({
        success: false,
        message: "Provide the productId",
      });

    const isProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!isProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    await prisma.cart.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        quantity: {
          increment: 1,
        },
      },
      create: {
        userId,
        productId,
        quantity: 1,
      },
    });

    return res.status(200).json({
      message: "Added to cart",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default addToCart;
