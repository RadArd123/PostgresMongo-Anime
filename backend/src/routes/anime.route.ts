import express from "express";
import { createAnime, getAnimeById, getAnimes, deleteAnime, updateAnime } from "../controllers/anime.controller";
import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";
import { cleanupUploadTempFiles, imageUpload, validateImageUploads } from "../middleware/imageUpload";
import { uploadLimiter } from "../middleware/rateLimits";
import { validateBody, validateId } from '../middleware/validate';
import { animeSchema } from '../schemas/content.schemas';

const router = express.Router();

router.post("/create-anime", verifyToken, isAdmin, uploadLimiter, imageUpload, cleanupUploadTempFiles, validateImageUploads, validateBody(animeSchema), createAnime);
router.get("/get-animes", getAnimes);
router.get("/:id", validateId(), getAnimeById);
router.delete("/delete-anime/:id",verifyToken,isAdmin, validateId(), deleteAnime);
router.put("/update-anime/:id",verifyToken,isAdmin, validateId(), validateBody(animeSchema), updateAnime);

export default router;
