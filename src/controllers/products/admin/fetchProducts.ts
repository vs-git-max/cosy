import type { Request, Response } from "express";
import { products } from "../../../db/schema";
import { and, or, ilike, asc, desc, SQL } from "drizzle-orm";
import { db } from "../../../lib/db";

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

    const conditions: SQL[] = [];

    // 🧪 filters
    if (filters && typeof filters === "object") {
      for (const key in filters) {
        // dynamic filter (basic equality)
        conditions.push(
          // @ts-ignore dynamic key access
          ilike(products[key], filters[key]),
        );
      }
    }

    // 🔍 search (name, description fields)
    if (search && typeof search === "string") {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.shortDescription, `%${search}%`),
          ilike(products.description, `%${search}%`),
        )!,
      );
    }

    // 📊 sorting
    const allowedSortFields = ["price", "name", "createdAt"] as const;
    type SortField = (typeof allowedSortFields)[number];

    let orderBy: ReturnType<typeof asc> | ReturnType<typeof desc> | undefined;

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
        orderBy =
          direction === "desc"
            ? desc(products[field as SortField])
            : asc(products[field as SortField]);
      }
    }

    // 📦 pagination
    const take = initialProducts ? parseInt(initialProducts, 10) : 30;

    // 🧾 query
    const result = await db
      .select()
      .from(products)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(orderBy as any)
      .limit(take);

    return res.status(200).json({
      products: result,
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
