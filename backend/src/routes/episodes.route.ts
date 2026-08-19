import express from "express";
import { createEpisode, getEpisodesByAnimeId,deleteEpisode, getEpisodeById, updateEpisode, getLatestEpisodes } from "../controllers/episodes.controller";
import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();

router.post("/createEpisode",verifyToken,isAdmin, createEpisode);
router.get("/latest", getLatestEpisodes);
router.get("/episodesByAnime/:animeId", getEpisodesByAnimeId);
router.delete("/deleteEpisode/:id",verifyToken,isAdmin, deleteEpisode); 
router.put("/updateEpisode/:id", verifyToken, isAdmin, updateEpisode);
router.get("/episode/:id", getEpisodeById);

export default router;