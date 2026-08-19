import express from 'express';
import {
  addOrUpdateProgress,
  getContinueWatching,
  removeContinueWatching,
  markCompletedContinueWatching
} from '../controllers/continueWatching.controller';
import { verifyToken } from '../middleware/verifyToken';

const router = express.Router();

router.post('/progress', verifyToken, addOrUpdateProgress);
router.get('/list', verifyToken, getContinueWatching);
router.delete('/remove/:episodeId', verifyToken, removeContinueWatching);
router.put('/complete/:episodeId', verifyToken, markCompletedContinueWatching);

export default router;
