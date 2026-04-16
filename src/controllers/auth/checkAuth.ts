import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
  };
}

export async function checkAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please authenticate...",
      });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      name: string;
      email: string;
      role: "ADMIN" | "USER";
    };

    req.user = {
      id: verified.id,
      name: verified.name,
      email: verified.email,
      role: verified.role,
    };

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Error checking auth",
    });
  }
}
