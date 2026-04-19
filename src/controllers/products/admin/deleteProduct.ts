import type { Request, Response } from "express";
import type { Params } from "./getProductsDetails";
import { products } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../../../lib/db";

const deleteProduct = async (req: Request<Params>, res: Response) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Please add the product id",
      });
    }

    // 🗑️ delete product
    const deleted = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning();

    // 🔍 check if product existed
    if (deleted.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default deleteProduct;
