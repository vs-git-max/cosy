import type { Response } from "express";
import type { AuthFavoritesRequest } from "./toggleFavorites";
import { prisma } from "../../lib/prisma";

const fetchUserFavorites = async (req: AuthFavoritesRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const [favs, totalFavorites] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId },
        select: {
          product: {
            select: {
              name: true,
              id: true,
              image: true,
              price: true,
              salesPrice: true,
            },
          },
        },
      }),
      prisma.favorite.count({ where: { userId } }),
    ]);

    return res.status(200).json({
      favs: favs.map((f: any) => f.product),
      totalFavorites,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default fetchUserFavorites;
