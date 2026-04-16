import { Router } from "express";
import addToCart from "../controllers/cart/addToCart";
import fetchCartItems from "../controllers/cart/fetchCartItems";
import deleteCart from "../controllers/cart/deteleCart";
import deleteCartItems from "../controllers/cart/deleteCartItem";

const cartRoute = Router();

cartRoute.post("/add", addToCart);
cartRoute.get("/fetch", fetchCartItems);
cartRoute.delete("/delete", deleteCart);
cartRoute.patch("/delete-item", deleteCartItems);

export default cartRoute;
