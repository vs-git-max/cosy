import type { Request, Response } from "express";

export async function logout(_req: Request, res: Response) {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json({
        success: true,
        message: "USer logged out successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error logging out",
    });
  }
}
