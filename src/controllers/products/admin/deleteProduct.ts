import type { Request, Response } from "express";
import type { Params } from "./getProductsDetails";
import { prisma } from "../../../lib/prisma";

const deleteProduct = async (req: Request<Params>, res: Response) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Please add the product id",
      });
    }

    await prisma.product.delete({ where: { id: productId } });

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.log(error);

    if (error?.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default deleteProduct;
