import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

const fetchUserProducts = async (req: Request, res: Response) => {
  try {
    const {
      hotFilterOptions,
      limit,
      page = 1,
      category,
      search,
      orderBy,
    } = req.query as {
      hotFilterOptions?: string;
      limit?: number;
      page?: number;
      category?: string[];
      search?: string;
      orderBy?: string;
    };

    const take = (limit || 10) * page;

    let orderByVal: any = { createdAt: "desc" };

    switch (hotFilterOptions) {
      case "hot-products":
        orderByVal = { salesPrice: "desc" };
        break;
      case "top-rated":
        orderByVal = { createdAt: "desc" };
        break;
      case "best-seller":
        orderByVal = { quantity: "desc" };
        break;
      default:
        if (orderBy) {
          switch (orderBy) {
            case "price-low-to-high":
              orderByVal = { price: "asc" };
              break;
            case "price-high-to-low":
              orderByVal = { price: "desc" };
              break;
            case "name-a-to-z":
              orderByVal = { name: "asc" };
              break;
            case "name-z-to-a":
              orderByVal = { name: "desc" };
              break;
          }
        }
        break;
    }

    let categoryArray: string[] | undefined;
    if (Array.isArray(category)) {
      categoryArray = category;
    } else if (typeof category === "string") {
      categoryArray = [category];
    }

    const where: any = {};

    if (categoryArray && categoryArray.length > 0) {
      where.category = {
        in: categoryArray,
      };
    }

    if (search && search.trim() !== "") {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: orderByVal,
        take,
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Products fetch success",
      total,
      page: Number(page),
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default fetchUserProducts;
