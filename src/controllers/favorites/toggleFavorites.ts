import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export interface AuthFavoritesRequest extends Request {
  user?: {
    id: string;
  };
}

const toggleFavorites = async (req: AuthFavoritesRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to continue...",
      });
    }

    if (!productId)
      return res.status(400).json({
        success: false,
        message: "Please provide the product...",
      });

    const [user, product] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.product.findUnique({ where: { id: productId } }),
    ]);

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not valid",
      });
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not valid",
      });

    let isFav: boolean;

    const existingFav = await prisma.favorite.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (existingFav) {
      await prisma.favorite.delete({
        where: {
          productId_userId: {
            productId,
            userId,
          },
        },
      });
      isFav = false;
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          productId,
        },
      });

      isFav = true;
    }

    return res.status(200).json({
      success: false,
      productId,
      isFavorite: isFav,
      message: !isFav
        ? "Product removed from fav"
        : "Product added to the favs",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default toggleFavorites;
