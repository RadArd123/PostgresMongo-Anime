import express from "express";
import { createEpisode, getEpisodesByAnimeId,deleteEpisode, getEpisodeById, updateEpisode, getLatestEpisodes } from "../controllers/episodes.controller";
import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";
import { validateBody, validateId } from '../middleware/validate';
import { episodeSchema, episodeUpdateSchema } from '../schemas/content.schemas';

const router = express.Router();

router.post("/createEpisode",verifyToken,isAdmin, validateBody(episodeSchema), createEpisode);
router.get("/latest", getLatestEpisodes);
router.get("/episodesByAnime/:animeId", validateId('animeId'), getEpisodesByAnimeId);
router.delete("/deleteEpisode/:id",verifyToken,isAdmin, validateId(), deleteEpisode);
router.put("/updateEpisode/:id", verifyToken, isAdmin, validateId(), validateBody(episodeUpdateSchema), updateEpisode);
router.get("/episode/:id", validateId(), getEpisodeById);

export default router;
