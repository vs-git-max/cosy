import type { Request, Response } from "express";
import { db } from "../../lib/db";
import { cart, products } from "../../db/schema";
import { eq, and, sql } from "drizzle-orm";

export interface AuthCartParams extends Request {
  user?: {
    id: string;
  };
}

const addToCart = async (req: AuthCartParams, res: Response) => {
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

    // 🔍 check product exists
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product[0]) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 🔍 check if cart item exists
    const existingCart = await db
      .select()
      .from(cart)
      .where(and(eq(cart.userId, userId), eq(cart.productId, productId)))
      .limit(1);

    // 🔁 update OR insert
    if (existingCart.length > 0) {
      await db
        .update(cart)
        .set({
          quantity: sql`${cart.quantity} + 1`,
        })
        .where(and(eq(cart.userId, userId), eq(cart.productId, productId)));
    } else {
      await db.insert(cart).values({
        userId,
        productId,
        quantity: 1,
      });
    }

    return res.status(200).json({
      message: "Added to cart",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default addToCart;
