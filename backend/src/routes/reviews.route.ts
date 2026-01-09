import express from 'express'
import { createReviews, getReviewsByAnimeId,deleteReviews } from '../controllers/reviews.controller'
import { verifyToken } from '../middleware/verifyToken';
import { isAdmin } from '../middleware/isAdmin';

const router = express.Router();

router.post('/createReviews',verifyToken, createReviews);
router.get('/getReviews/:animeId', getReviewsByAnimeId);
router.delete('/deleteReviews/:id',verifyToken, isAdmin, deleteReviews);

export default router