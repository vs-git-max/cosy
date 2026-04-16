import { Router } from "express";
import fetchUserProducts from "../controllers/products/client/fetchProducts";
import fetchSingleProductDetails from "../controllers/products/client/fetchSingleProductDetails";

const userProductsRoutes = Router();

userProductsRoutes.get("/fetch-products", fetchUserProducts);
userProductsRoutes.get(
  "/product-details/:productId",
  fetchSingleProductDetails,
);

export default userProductsRoutes;
