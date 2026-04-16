import type { Response } from "express";
import type { AuthCartParams } from "./addToCart";
import { prisma } from "../../lib/prisma";

const deleteCartItems = async (req: AuthCartParams, res: Response) => {
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

    const existingItem = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!existingItem)
      return res.status(404).json({
        message: "Cart item not found",
      });

    let message: string;

    if (existingItem.quantity > 1) {
      await prisma.cart.update({
        where: {
          userId_productId: { userId, productId },
        },
        data: {
          quantity: {
            decrement: 1,
          },
        },
      });
      message = "Cart quantity decreased";
    } else {
      await prisma.cart.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      message = "Product deleted from Cart";
    }

    res.status(200).json({
      message,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default deleteCartItems;
