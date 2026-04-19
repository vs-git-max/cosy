import type { Request, Response } from "express";
import type { Params } from "./getProductsDetails";
import { products } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../../../lib/db";

interface UpdatedProductProps {
  name?: string;
  shortDescription?: string;
  image?: string;
  category?: string;
  price?: number;
  salesPrice?: number;
  description?: string;
  quantity?: number;
}

const editProduct = async (
  req: Request<Params, {}, UpdatedProductProps>,
  res: Response,
) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Please add the product id",
      });
    }

    console.log(req.body);

    const {
      name,
      shortDescription,
      image,
      category,
      price,
      salesPrice,
      description,
      quantity,
    } = req.body;

    // 🧱 build dynamic update object
    const dataToUpdate: UpdatedProductProps = {
      ...(name !== undefined && { name }),
      ...(shortDescription !== undefined && { shortDescription }),
      ...(image !== undefined && { image }),
      ...(category !== undefined && { category }),
      ...(price !== undefined && { price }),
      ...(salesPrice !== undefined && { salesPrice }),
      ...(description !== undefined && { description }),
      ...(quantity !== undefined && { quantity }),
    };

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update",
      });
    }

    // 🔄 update product
    const updated = await db
      .update(products)
      .set(dataToUpdate)
      .where(eq(products.id, productId))
      .returning();

    // ❌ not found handling (Drizzle style)
    if (updated.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updated[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default editProduct;
