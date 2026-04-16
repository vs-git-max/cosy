import type { Response } from "express";
import type { AuthRequest } from "../auth/checkAuth";
import { prisma } from "../../lib/prisma";

const fetchAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user?.role;

    if (role !== "ADMIN")
      return res.status(403).json({
        message: "The user is not an admin",
      });

    const users = await prisma.user.findMany({
      select: {
        name: true,
        id: true,
        cart: true,
        email: true,
      },
    });

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default fetchAllUsers;
