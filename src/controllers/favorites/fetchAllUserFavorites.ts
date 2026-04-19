import type { Response } from "express";
import type { AuthFavoritesRequest } from "./toggleFavorites";
import { favorites, products } from "../../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../../lib/db";

const fetchUserFavorites = async (req: AuthFavoritesRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized...",
      });
    }

    // 📦 fetch favorites with product join
    const favs = await db
      .select({
        product: {
          id: products.id,
          name: products.name,
          image: products.image,
          price: products.price,
          salesPrice: products.salesPrice,
        },
      })
      .from(favorites)
      .leftJoin(products, eq(favorites.productId, products.id))
      .where(eq(favorites.userId, userId));

    // 📊 count favorites separately
    const totalResult = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId));

    const totalFavorites = totalResult.length;

    return res.status(200).json({
      favs: favs.map((f) => f.product),
      totalFavorites,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default fetchUserFavorites;
