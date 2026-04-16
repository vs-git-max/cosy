import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

interface Params {
  productId: string;
}

const fetchSingleProductDetails = async (
  req: Request<Params>,
  res: Response,
) => {
  try {
    const { productId } = req.params;

    if (!productId)
      return res.status(403).json({
        success: false,
        message: "Provide the product id",
      });

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    return res.status(200).json({
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default fetchSingleProductDetails;
