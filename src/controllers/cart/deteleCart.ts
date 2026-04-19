import type { Response } from "express";
import type { AuthCartParams } from "./addToCart";
import { cart } from "../../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../../lib/db";

const deleteCart = async (req: AuthCartParams, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized...",
      });
    }

    // 🗑️ delete all cart items for user
    await db.delete(cart).where(eq(cart.userId, userId));

    return res.status(200).json({
      message: "Cart deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default deleteCart;
