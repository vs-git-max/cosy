import { Router } from "express";
import toggleFavorites from "../controllers/favorites/toggleFavorites";
import { checkAuth } from "../controllers/auth/checkAuth";
import fetchUserFavorites from "../controllers/favorites/fetchAllUserFavorites";

const favoritesRoutes = Router();

favoritesRoutes.post("/toggle-fav", toggleFavorites);
favoritesRoutes.get("/fetch-fav", fetchUserFavorites);

export default favoritesRoutes;
