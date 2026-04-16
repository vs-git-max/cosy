import { Router } from "express";
import fetchUserBlog from "../controllers/blog/client/fetchBlogs";
import fetchUserBlogDetails from "../controllers/blog/client/fetchUserBlogDetails";

const userBlogRoutes = Router();

userBlogRoutes.get("/fetch", fetchUserBlog);
userBlogRoutes.get("/fetch-details/:blogId", fetchUserBlogDetails);

export default userBlogRoutes;
