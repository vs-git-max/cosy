import type { Request, Response } from "express";
import { favorites, users, products } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { db } from "../../lib/db";

export interface AuthFavoritesRequest extends Request {
  user?: {
    id: string;
  };
}

const toggleFavorites = async (req: AuthFavoritesRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    // 🔐 auth check
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to continue...",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Please provide the product...",
      });
    }

    // 🔍 validate user + product
    const [user, product] = await Promise.all([
      db.select().from(users).where(eq(users.id, userId)).limit(1),
      db.select().from(products).where(eq(products.id, productId)).limit(1),
    ]);

    if (!user[0]) {
      return res.status(404).json({
        success: false,
        message: "User not valid",
      });
    }

    if (!product[0]) {
      return res.status(404).json({
        success: false,
        message: "Product not valid",
      });
    }

    // 🔍 check existing favorite
    const existingFav = await db
      .select()
      .from(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.productId, productId)),
      )
      .limit(1);

    let isFav: boolean;

    // 🔁 toggle logic
    if (existingFav.length > 0) {
      await db
        .delete(favorites)
        .where(
          and(eq(favorites.userId, userId), eq(favorites.productId, productId)),
        );

      isFav = false;
    } else {
      await db.insert(favorites).values({
        userId,
        productId,
      });

      isFav = true;
    }

    return res.status(200).json({
      success: true,
      productId,
      isFavorite: isFav,
      message: !isFav
        ? "Product removed from fav"
        : "Product added to the favs",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default toggleFavorites;
