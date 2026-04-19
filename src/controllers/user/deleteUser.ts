import type { Response } from "express";
import type { AuthRequest } from "../auth/checkAuth";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../../lib/db";

const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user?.role;

    // 🔐 admin check
    if (role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "The user is not an admin",
      });
    }

    const { userId } = req.params as { userId: string };

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please pass the user id",
      });
    }

    // 🗑️ delete user
    const deleted = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    // ❌ not found
    if (deleted.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default deleteUser;
