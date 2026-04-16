import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

interface FetchProductsQuery {
  filters?: Record<string, string>;
  sortOptions?: string[] | string;
  initialProducts?: string;
  search?: string;
}

const fetchProducts = async (
  req: Request<{}, {}, {}, FetchProductsQuery>,
  res: Response,
) => {
  try {
    const { search, filters, sortOptions, initialProducts } = req.query;

    const where: Record<string, any> = {};

    // ✅ filtering
    if (filters && typeof filters === "object") {
      for (const key in filters) {
        where[key] = filters[key];
      }
    }

    // ✅ searching
    if (search && typeof search === "string") {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          shortDescription: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // ✅ sorting
    const allowedSortFields = ["price", "name", "createdAt"] as const;
    type SortField = (typeof allowedSortFields)[number];

    let orderBy: { [key in SortField]?: "asc" | "desc" } | undefined;

    const sortArray = Array.isArray(sortOptions)
      ? sortOptions
      : sortOptions
        ? [sortOptions]
        : [];

    if (sortArray.length > 0) {
      const sort = sortArray[0];
      if (!sort) return;

      const [field, direction] = sort.split("-");

      if (allowedSortFields.includes(field as SortField)) {
        orderBy = {
          [field as SortField]: direction === "desc" ? "desc" : "asc",
        };
      }
    }

    // ✅ initialProducts fix (comes as string from query)
    const take = initialProducts ? parseInt(initialProducts, 10) : 30;

    const filteredProducts = await prisma.product.findMany({
      where,
      orderBy,
      take,
    });

    return res.status(200).json({
      products: filteredProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default fetchProducts;
