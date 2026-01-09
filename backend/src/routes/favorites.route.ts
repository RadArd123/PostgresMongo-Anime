import express from 'express';
import { addFavorites, getFavorites, deleteFavorites } from '../controllers/favorites.controller';
import { verifyToken } from '../middleware/verifyToken';

const router = express.Router();

router.post("/addFavorites",verifyToken, addFavorites );
router.get("/getFavorites", verifyToken, getFavorites);
router.delete("/deleteFavorites/:animeId", verifyToken, deleteFavorites)

export default router;