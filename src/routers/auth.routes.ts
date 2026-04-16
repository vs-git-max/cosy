import { Router } from "express";
import { signup } from "../controllers/auth/signup";
import { login } from "../controllers/auth/login";
import { logout } from "../controllers/auth/logout";
import { checkAuth, type AuthRequest } from "../controllers/auth/checkAuth";
import rateLimiter from "../middleware/rate-limiter";

const authRoutes = Router();

authRoutes.post("/signup", rateLimiter, signup);
authRoutes.post("/login", rateLimiter, login);
authRoutes.post("/logout", logout);
authRoutes.get("/check-auth", checkAuth, (req: AuthRequest, res) => {
  res.json({
    success: true,
    user: req?.user,
  });
});

export default authRoutes;
