//importing the dependencies
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

//importing the functions
import authRoutes from "./src/routers/auth.routes";
import adminProductsRoute from "./src/routers/admin.products.routes";
import imageUploadRoute from "./src/routers/image.routes";
import userProductsRoutes from "./src/routers/user.products.routes";
import rateLimiter from "./src/middleware/rate-limiter";
import favoritesRoutes from "./src/routers/favorites.routes";
import { checkAuth } from "./src/controllers/auth/checkAuth";
import cartRoute from "./src/routers/cart.routes";
import userBlogRoutes from "./src/routers/user.blog.routes";
import adminBlogRoutes from "./src/routers/admin.blog.routes";
import adminUserRoutes from "./src/routers/admin.user.routes";

//port
const PORT = process.env.PORT || 8001;

//creating the app
const app = express();

//using the app
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "https://cosycraft-furniture.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

app.use(express.json());

//using the functions
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin/image", imageUploadRoute);
app.use("/api/v1/user/products", userProductsRoutes);
app.use("/api/v1/user/blog", rateLimiter, userBlogRoutes);
app.use("/api/v1/cart", rateLimiter, checkAuth, cartRoute);
app.use("/api/v1/admin/user", checkAuth, adminUserRoutes);
app.use("/api/v1/admin/blog", rateLimiter, adminBlogRoutes);
app.use("/api/v1/favorites", rateLimiter, checkAuth, favoritesRoutes);
app.use("/api/v1/admin/admin-products", rateLimiter, adminProductsRoute);

//health check
app.get("/health", (_req, res) => {
  res.json({
    message: "server is running",
  });
});

//listening to the app
app.listen(PORT, () => {
  console.log(`Server is running port ${PORT}`);
});
