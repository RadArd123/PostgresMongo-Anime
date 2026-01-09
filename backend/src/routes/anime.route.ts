import express from "express";
import { createAnime, getAnimeById, getAnimes, deleteAnime, updateAnime } from "../controllers/anime.controller";
import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();

router.post("/create-anime",verifyToken,isAdmin, createAnime);
router.get("/get-animes", getAnimes);
router.get("/:id", getAnimeById);
router.delete("/delete-anime/:id",verifyToken,isAdmin, deleteAnime);
router.put("/update-anime/:id",verifyToken,isAdmin, updateAnime);

export default router;