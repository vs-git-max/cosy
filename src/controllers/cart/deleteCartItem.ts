import type { Response } from "express";
import type { AuthCartParams } from "./addToCart";
import { db } from "../../lib/db";
import { cart } from "../../db/schema";
import { eq, and, sql } from "drizzle-orm";

const deleteCartItems = async (req: AuthCartParams, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized...",
      });
    }

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Provide the productId",
      });
    }

    // 🔍 find cart item
    const existingItem = await db
      .select()
      .from(cart)
      .where(and(eq(cart.userId, userId), eq(cart.productId, productId)))
      .limit(1);

    if (!existingItem[0]) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    let message: string;

    const item = existingItem[0];

    if (!item || (item.quantity ?? 0) > 1) {
      // 🔻 decrease quantity or delete
      await db
        .update(cart)
        .set({
          quantity: sql`${cart.quantity} - 1`,
        })
        .where(and(eq(cart.userId, userId), eq(cart.productId, productId)));

      message = "Cart quantity decreased";
    } else {
      await db
        .delete(cart)
        .where(and(eq(cart.userId, userId), eq(cart.productId, productId)));

      message = "Product deleted from Cart";
    }

    return res.status(200).json({
      message,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default deleteCartItems;
