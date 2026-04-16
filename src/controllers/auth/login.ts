import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { confirmPassword } from "../../helpers/password";
import jwt from "jsonwebtoken";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Add all fields",
      });
    }

    //check if user
    const isUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!isUser) {
      return res.status(404).json({
        success: false,
        message: "User with the email not found",
      });
    }

    //confirm the password
    const correctPassword = await confirmPassword(password, isUser.password);
    if (!correctPassword) {
      return res.status(400).json({
        success: false,
        message: "Please add the correct password",
      });
    }

    const { password: _, ...newUserWIthoutPassword } = isUser;

    //creating the token again
    const token = jwt.sign(
      {
        id: newUserWIthoutPassword.id,
        name: newUserWIthoutPassword.name,
        role: newUserWIthoutPassword.role,
        email: newUserWIthoutPassword.email,
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
        data: newUserWIthoutPassword,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
    });
  }
}
