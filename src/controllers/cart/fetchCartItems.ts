import type { Response } from "express";
import type { AuthCartParams } from "./addToCart";
import { prisma } from "../../lib/prisma";

const fetchCartItems = async (req: AuthCartParams, res: Response) => {
  try {
    const userId = req.user?.id;

    const [cartProducts, total] = await Promise.all([
      await prisma.cart.findMany({
        where: { userId },
        include: { product: true },
        orderBy: {
          createdAt: "desc",
        },
      }),
      await prisma.cart.count({ where: { userId } }),
    ]);

    const cartItemsWithTotal = cartProducts.map((item: any) => ({
      ...item,
      totalPrice:
        item.quantity *
        (item.product.salesPrice > 0
          ? item.product.salesPrice
          : item.product.price),
    }));

    const totalWithoutTax = cartItemsWithTotal.reduce(
      (sum: number, current: any) => sum + current.totalPrice,
      0,
    );
    const tax = totalWithoutTax * 0.05;

    const grandTotal = totalWithoutTax + Number(tax.toFixed(2));

    res.status(200).json({
      cartItems: cartItemsWithTotal,
      totalCartItems: total,
      totalWithoutTax,
      tax: tax.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default fetchCartItems;
