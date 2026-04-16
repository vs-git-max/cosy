import { Router } from "express";
import addNewProduct from "../controllers/products/admin/addNewProduct";
import fetchProducts from "../controllers/products/admin/fetchProducts";
import getProductDetails from "../controllers/products/admin/getProductsDetails";
import deleteProduct from "../controllers/products/admin/deleteProduct";
import editProduct from "../controllers/products/admin/editProduct";

const adminProductsRoute = Router();

adminProductsRoute.get("/fetch-products", fetchProducts);
adminProductsRoute.post("/add-new-product", addNewProduct);
adminProductsRoute.put("/edit-product/:productId", editProduct);
adminProductsRoute.delete("/delete-product/:productId", deleteProduct);
adminProductsRoute.get("/product-details/:productId", getProductDetails);

export default adminProductsRoute;
