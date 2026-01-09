import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";
import express from "express";
import { addAnimeNews, addHeroAnime, addSuggestedAnime, getAnimeNews, getHeroAnimes, getSuggestedAnimes, removeAnimeNews, removeHeroAnime, removeSuggestedAnime } from "../controllers/animeMongo.controller";

const router = express.Router();

router.post("/addHeroAnime", verifyToken, isAdmin, addHeroAnime);
router.get("/getHeroAnimes", getHeroAnimes);
router.delete("/removeHeroAnime/:id", verifyToken, isAdmin, removeHeroAnime);

router.post("/addAnimeNews", verifyToken, isAdmin, addAnimeNews);
router.get("/getAnimeNews", getAnimeNews);
router.delete("/removeAnimeNews/:id", verifyToken, isAdmin, removeAnimeNews);

router.post("/addSuggestedAnime", verifyToken, isAdmin, addSuggestedAnime);
router.get("/getSuggestedAnimes", getSuggestedAnimes);
router.delete("/removeSuggestedAnime/:id", verifyToken, isAdmin, removeSuggestedAnime);

export default router;