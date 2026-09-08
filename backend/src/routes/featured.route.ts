import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";
import express from "express";
import { 
    addAnimeNews, addHeroAnime, addSuggestedAnime, 
    getAnimeNews, getHeroAnimes, getSuggestedAnimes, 
    removeAnimeNews, removeHeroAnime, removeSuggestedAnime,
    updateHeroAnime, updateSuggestedAnime, updateAnimeNews
} from "../controllers/featured.controller";
import { cleanupUploadTempFiles, imageUpload, validateImageUploads } from "../middleware/imageUpload";
import { uploadLimiter } from "../middleware/rateLimits";

import { validateBody, validateId } from '../middleware/validate';
import { heroSchema, suggestedSchema, newsSchema } from '../schemas/content.schemas';

const router = express.Router();

router.post("/addHeroAnime", verifyToken, isAdmin, uploadLimiter, imageUpload, cleanupUploadTempFiles, validateImageUploads, validateBody(heroSchema), addHeroAnime);
router.get("/getHeroAnimes", getHeroAnimes);
router.delete("/removeHeroAnime/:id", verifyToken, isAdmin, validateId(), removeHeroAnime);
router.put("/updateHeroAnime/:id", verifyToken, isAdmin, validateId(), validateBody(heroSchema), updateHeroAnime);

router.post("/addAnimeNews", verifyToken, isAdmin, uploadLimiter, imageUpload, cleanupUploadTempFiles, validateImageUploads, validateBody(newsSchema), addAnimeNews);
router.get("/getAnimeNews", getAnimeNews);
router.delete("/removeAnimeNews/:id", verifyToken, isAdmin, validateId(), removeAnimeNews);
router.put("/updateAnimeNews/:id", verifyToken, isAdmin, validateId(), validateBody(newsSchema), updateAnimeNews);

router.post("/addSuggestedAnime", verifyToken, isAdmin, uploadLimiter, imageUpload, cleanupUploadTempFiles, validateImageUploads, validateBody(suggestedSchema), addSuggestedAnime);
router.get("/getSuggestedAnimes", getSuggestedAnimes);
router.delete("/removeSuggestedAnime/:id", verifyToken, isAdmin, validateId(), removeSuggestedAnime);
router.put("/updateSuggestedAnime/:id", verifyToken, isAdmin, validateId(), validateBody(suggestedSchema), updateSuggestedAnime);

export default router;
