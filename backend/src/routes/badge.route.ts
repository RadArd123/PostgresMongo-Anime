import express from 'express';
import {
  getAllBadges,
  getUserBadges,
  createBadge,
  deleteBadge,
  awardBadge,
  checkSubscription,
  subscribeToAnime,
  unsubscribeFromAnime,
  sendAdminMessage,
  broadcastSystemNotification,
} from '../controllers/badge.controller';
import { verifyToken } from '../middleware/verifyToken';
import { isAdmin } from '../middleware/isAdmin';
import { updateBadge, revokeBadge } from '../controllers/adminCrud.controller';
import { validateBody, validateId } from '../middleware/validate';
import { badgeSchema } from '../schemas/content.schemas';

const router = express.Router();
router.put('/:id', verifyToken, isAdmin, validateId(), validateBody(badgeSchema), updateBadge);
router.delete('/user/:userId/:badgeId', verifyToken, isAdmin, validateId('userId'), validateId('badgeId'), revokeBadge);

// Public
router.get('/', getAllBadges);
router.get('/user/:userId', getUserBadges);

// User: anime subscriptions (requires login)
router.get('/subscriptions/:animeId', verifyToken as express.RequestHandler, checkSubscription as express.RequestHandler);
router.post('/subscriptions/:animeId', verifyToken as express.RequestHandler, subscribeToAnime as express.RequestHandler);
router.delete('/subscriptions/:animeId', verifyToken as express.RequestHandler, unsubscribeFromAnime as express.RequestHandler);

// Admin only
router.post('/', verifyToken, isAdmin, validateBody(badgeSchema), createBadge);
router.delete('/:id', verifyToken as express.RequestHandler, isAdmin as express.RequestHandler, deleteBadge as express.RequestHandler);
router.post('/award', verifyToken as express.RequestHandler, isAdmin as express.RequestHandler, awardBadge as express.RequestHandler);
router.post('/admin/message', verifyToken as express.RequestHandler, isAdmin as express.RequestHandler, sendAdminMessage as express.RequestHandler);
router.post('/admin/broadcast', verifyToken as express.RequestHandler, isAdmin as express.RequestHandler, broadcastSystemNotification as express.RequestHandler);

export default router;
