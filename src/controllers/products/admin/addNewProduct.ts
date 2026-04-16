import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

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

    //checking if the product already exists
    const alreadyProduct = await prisma.product.findUnique({ where: { name } });
    if (alreadyProduct) {
      return res.status(409).json({
        success: false,
        message: "Product with the name already exists",
      });
    }

    await prisma.product.create({
      data: {
        name,
        shortDescription,
        category,
        image,
        description,
        price,
        salesPrice,
        quantity,
      },
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
