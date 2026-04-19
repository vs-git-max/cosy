import type { Request, Response } from "express";
import { products } from "../../../db/schema";
import { and, or, ilike, asc, desc, SQL, sql } from "drizzle-orm";
import { db } from "../../../lib/db";

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
      category?: string[] | string;
      search?: string;
      orderBy?: string;
    };

    const take = (Number(limit) || 10) * Number(page);

    // 📊 ORDER BY logic
    let orderByVal:
      | ReturnType<typeof asc>
      | ReturnType<typeof desc>
      | undefined;

    switch (hotFilterOptions) {
      case "hot-products":
        orderByVal = desc(products.salesPrice);
        break;
      case "top-rated":
        orderByVal = desc(products.createdAt);
        break;
      case "best-seller":
        orderByVal = desc(products.quantity);
        break;
      default:
        if (orderBy) {
          switch (orderBy) {
            case "price-low-to-high":
              orderByVal = asc(products.price);
              break;
            case "price-high-to-low":
              orderByVal = desc(products.price);
              break;
            case "name-a-to-z":
              orderByVal = asc(products.name);
              break;
            case "name-z-to-a":
              orderByVal = desc(products.name);
              break;
            default:
              orderByVal = desc(products.createdAt);
          }
        } else {
          orderByVal = desc(products.createdAt);
        }
    }

    // 📂 category normalization
    let categoryArray: string[] | undefined;

    if (Array.isArray(category)) {
      categoryArray = category;
    } else if (typeof category === "string") {
      categoryArray = [category];
    }

    const conditions: SQL[] = [];

    // 📂 category filter
    if (categoryArray && categoryArray.length > 0) {
      conditions.push(sql`${products.category} = ANY(${categoryArray})`);
    }

    // 🔍 search filter
    if (search && search.trim() !== "") {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`),
          ilike(products.shortDescription, `%${search}%`),
        )!,
      );
    }

    // 📊 total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(conditions.length ? and(...conditions) : undefined);

    const total = Number(totalResult[0]?.count || 0);

    // 📦 products query
    const productList = await db
      .select()
      .from(products)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(orderByVal!)
      .limit(take);

    return res.status(200).json({
      success: true,
      message: "Products fetch success",
      total,
      page: Number(page),
      products: productList,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default fetchUserProducts;
