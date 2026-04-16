import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
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

    //check if the email already exists
    const isUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isUser) {
      return res.status(400).json({
        success: false,
        message: "User with the email already exists",
      });
    }

    //hashing the password
    const encryptedPassword = await encryptPassword(password, 12);

    //working on the roles
    let userRole: "USER" | "ADMIN" = "USER";
    if (email === (process.env.ADMIN_EMAIL as string)) {
      userRole = "ADMIN";
    }

    //creating the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: encryptedPassword,
        role: userRole,
      },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
      },
    });

    //token
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
