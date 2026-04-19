import type { Request, Response } from "express";
import { products } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../../../lib/db";

const addNewProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      shortDescription,
      category,
      image,
      description,
      price,
      salesPrice,
      quantity,
    } = req.body;

    console.log(req.body);

    // 🧪 validation
    if (
      [
        name,
        shortDescription,
        category,
        image,
        description,
        price,
        quantity,
      ].some(
        (item) => !item || item === undefined || item === "" || item === null,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Add all the fields",
      });
    }

    // 🔍 check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.name, name))
      .limit(1);

    if (existingProduct.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Product with the name already exists",
      });
    }

    // 🧾 create product
    await db.insert(products).values({
      name,
      shortDescription,
      category,
      image,
      description,
      price,
      salesPrice,
      quantity,
    });

    return res.status(200).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default addNewProduct;
