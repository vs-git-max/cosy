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

    // 📦 Fetch cart items with product join
    const cartProducts = await db
      .select({
        productId: cart.productId,
        quantity: cart.quantity,

        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          image: products.image,
          salesPrice: products.salesPrice,
        },
      })
      .from(cart)
      .leftJoin(products, eq(cart.productId, products.id))
      .where(eq(cart.userId, userId))
      .orderBy(desc(cart.createdAt));

    // 📊 total items count
    const total = cartProducts.length;

    // 💰 map with calculated totalPrice
    const cartItemsWithTotal = cartProducts.map((item) => {
      const qyt = item.quantity ?? 0;

      const price =
        (item.product?.salesPrice ?? 0) > 0
          ? item.product!.salesPrice
          : item.product!.price;

      return {
        productId: item.productId,
        quantity: qyt,
        product: item.product,
        totalPrice: qyt * price,
      };
    });

    // 💵 totals
    const totalWithoutTax = cartItemsWithTotal.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    const tax = totalWithoutTax * 0.05;
    const grandTotal = totalWithoutTax + tax;

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
