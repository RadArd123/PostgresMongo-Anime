import express from 'express';
import {
  addOrUpdateProgress,
  getContinueWatching,
  removeContinueWatching,
  markCompletedContinueWatching,
  getEpisodeProgress
} from '../controllers/continueWatching.controller';
import { verifyToken } from '../middleware/verifyToken';
import { z } from 'zod';
import { positiveId, validateBody, validateId } from '../middleware/validate';

const router = express.Router();

router.post('/progress', verifyToken, validateBody(z.object({ animeId: positiveId, episodeId: positiveId, progressSeconds: z.number().int().min(0).max(86400).optional(), durationSeconds: z.number().int().min(0).max(86400).optional(), completed: z.boolean().optional() }).strict()), addOrUpdateProgress);
router.get('/episode/:episodeId', verifyToken, validateId('episodeId'), getEpisodeProgress);
router.get('/list', verifyToken, getContinueWatching);
router.delete('/remove/:episodeId', verifyToken, removeContinueWatching);
router.put('/complete/:episodeId', verifyToken, markCompletedContinueWatching);

export default router;
