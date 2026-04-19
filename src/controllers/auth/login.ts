import type { Request, Response } from "express";
import { db } from "../../lib/db";
import { confirmPassword } from "../../helpers/password";
import jwt from "jsonwebtoken";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Add all fields",
      });
    }

    const isUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = isUser[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with the email not found",
      });
    }

    // 🔐 confirm password
    const correctPassword = await confirmPassword(password, user.password);

    if (!correctPassword) {
      return res.status(400).json({
        success: false,
        message: "Please add the correct password",
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    // 🎟️ create token
    const token = jwt.sign(
      {
        id: userWithoutPassword.id,
        name: userWithoutPassword.name,
        role: userWithoutPassword.role,
        email: userWithoutPassword.email,
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
        message: "Login success...",
        data: userWithoutPassword,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
    });
  }
}
