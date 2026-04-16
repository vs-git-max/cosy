import type { Response } from "express";
import type { AuthCartParams } from "./addToCart";
import { prisma } from "../../lib/prisma";

const deleteCart = async (req: AuthCartParams, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(403).json({
        success: false,
        message: "Unauthorized...",
      });

    await prisma.cart.deleteMany({
      where: { userId },
    });

    res.status(200).json({
      message: "Cart deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default deleteCart;
