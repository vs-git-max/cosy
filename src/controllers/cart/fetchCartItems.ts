import type { Response } from "express";
import type { AuthCartParams } from "./addToCart";
import { cart, products } from "../../db/schema";
import { eq, desc } from "drizzle-orm";
import { db } from "../../lib/db";

const fetchCartItems = async (req: AuthCartParams, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized...",
      });
    }

    // 📦 fetch cart + join product (manual join in Drizzle)
    const cartProducts = await db
      .select({
        id: cart.id,
        quantity: cart.quantity,
        createdAt: cart.createdAt,

        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          salesPrice: products.salesPrice,
        },
      })
      .from(cart)
      .leftJoin(products, eq(cart.productId, products.id))
      .where(eq(cart.userId, userId))
      .orderBy(desc(cart.createdAt));

    // 📊 count total items
    const totalResult = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId));

    const total = totalResult.length;

    // 💰 compute totals
    const cartItemsWithTotal = cartProducts.map((item) => {
      const price =
        (item.product?.salesPrice ?? 0) > 0
          ? item.product?.salesPrice!
          : item.product?.price!;

      return {
        ...item,
        totalPrice: (item.quantity ?? 0) * price,
      };
    });

    const totalWithoutTax = cartItemsWithTotal.reduce(
      (sum, current) => sum + current.totalPrice,
      0,
    );

    const tax = totalWithoutTax * 0.05;
    const grandTotal = totalWithoutTax + Number(tax.toFixed(2));

    return res.status(200).json({
      cartItems: cartItemsWithTotal,
      totalCartItems: total,
      totalWithoutTax,
      tax: tax.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default fetchCartItems;
