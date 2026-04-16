import { Router } from "express";
import fetchAdminBlog from "../controllers/blog/admin/fetchBlog";
import addBlog from "../controllers/blog/admin/addBlog";
import editBlog from "../controllers/blog/admin/editBlog";
import deleteBlog from "../controllers/blog/admin/deleteBlog";

const adminBlogRoutes = Router();

adminBlogRoutes.get("/fetch", fetchAdminBlog);
adminBlogRoutes.post("/add", addBlog);
adminBlogRoutes.patch("/edit", editBlog);
adminBlogRoutes.delete("/delete", deleteBlog);

export default adminBlogRoutes;
