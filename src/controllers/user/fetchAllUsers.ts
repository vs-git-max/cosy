import type { Response } from "express";
import type { AuthRequest } from "../auth/checkAuth";
import { users, cart } from "../../db/schema";
import { db } from "../../lib/db";

const fetchAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user?.role;

    // 🔐 admin check
    if (role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "The user is not an admin",
      });
    }

    // 👥 fetch users
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users);

    // 🛒 fetch carts separately (Drizzle doesn't auto-join like Prisma)
    const carts = await db.select().from(cart);

    // 🔗 attach cart items to users manually
    const usersWithCart = allUsers.map((user) => ({
      ...user,
      cart: carts.filter((c) => c.userId === user.id),
    }));

    return res.status(200).json({
      users: usersWithCart,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default fetchAllUsers;
