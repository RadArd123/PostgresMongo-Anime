import express from 'express'
import { addWatchlist, getWatchlist, removeWatchlist } from '../controllers/watchlist.controller';
import { verifyToken } from '../middleware/verifyToken';


const router = express.Router();

router.post('/addWatchlist',verifyToken, addWatchlist);
router.get('/getWatchlist',verifyToken, getWatchlist);
router.delete('/removeFromWatchlist/:animeId',verifyToken, removeWatchlist)

export default router