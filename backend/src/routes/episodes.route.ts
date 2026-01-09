import express from "express";
import { createEpisode, getEpisodesByAnimeId,deleteEpisode, getEpisodeById } from "../controllers/episodes.controller";
import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();

router.post("/createEpisode",verifyToken,isAdmin, createEpisode);
router.get("/episodesByAnime/:animeId", getEpisodesByAnimeId);
router.delete("/deleteEpisode/:id",verifyToken,isAdmin, deleteEpisode); 
router.get("/episode/:id", getEpisodeById);

export default router;