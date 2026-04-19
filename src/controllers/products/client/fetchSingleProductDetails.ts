import type { Request, Response } from "express";
import { products } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../../../lib/db";

interface Params {
  productId: string;
}

const fetchSingleProductDetails = async (
  req: Request<Params>,
  res: Response,
) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(403).json({
        success: false,
        message: "Provide the product id",
      });
    }

    // 🔍 fetch product
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    const product = result[0];

    // ❌ not found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      product,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default fetchSingleProductDetails;
