import type { Request, Response } from "express";
import { db } from "../../lib/db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { encryptPassword } from "../../helpers/password";
import jwt from "jsonwebtoken";

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    if ([email, password, name].some((item) => !item)) {
      return res.status(403).json({
        success: false,
        message: "Add all the fields",
      });
    }

    // 🔍 check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User with the email already exists",
      });
    }

    // 🔐 hash password
    const encryptedPassword = await encryptPassword(password, 12);

    // 👑 role logic
    let userRole: "USER" | "ADMIN" = "USER";
    if (email === process.env.ADMIN_EMAIL) {
      userRole = "ADMIN";
    }

    // 🧑 create user
    const insertedUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: encryptedPassword,
        role: userRole,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    const newUser = insertedUser[0];

    if (!newUser) return;

    // 🎟️ token
    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        role: newUser.role,
        email: newUser.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" },
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" || true,
        sameSite: "strict",
        maxAge: 2 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
