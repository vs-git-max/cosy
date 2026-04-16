import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
export interface Params {
  productId: string;
}

const getProductDetails = async (req: Request<Params>, res: Response) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Please add the product id",
      });
    }

    const isProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!isProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      product: isProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default getProductDetails;
