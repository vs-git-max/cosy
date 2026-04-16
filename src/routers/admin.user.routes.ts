import { Router } from "express";
import fetchAllUsers from "../controllers/user/fetchAllUsers";
import deleteUser from "../controllers/user/deleteUser";

const adminUserRoutes = Router();

adminUserRoutes.get("/fetch-users", fetchAllUsers);
adminUserRoutes.delete("/delete-user/:userId", deleteUser);

export default adminUserRoutes;
