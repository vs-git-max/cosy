import type { Response } from "express";
import type { AuthRequest } from "../auth/checkAuth";
import { prisma } from "../../lib/prisma";

const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user?.role;

    if (role !== "ADMIN")
      return res.status(403).json({
        message: "The user is not an admin",
      });

    const userId = req.params as {
      userId: string;
    };

    if (!userId)
      return res.status(401).json({
        message: "Please pass the user id",
      });

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error: any) {
    if (error.code === "P2025")
      return res.status(404).json({
        message: "User not found",
      });
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default deleteUser;
