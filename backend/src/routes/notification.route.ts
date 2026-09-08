import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getPreferences,
  updatePreferences,
} from '../controllers/notification.controller';
import { verifyToken } from '../middleware/verifyToken';

const router = express.Router();

// All routes require authentication
router.use(verifyToken as express.RequestHandler);

router.get('/', getNotifications as express.RequestHandler);
router.get('/unread-count', getUnreadCount as express.RequestHandler);
router.get('/preferences', getPreferences as express.RequestHandler);

router.patch('/read-all', markAllAsRead as express.RequestHandler);
router.patch('/:id/read', markAsRead as express.RequestHandler);

router.put('/preferences', updatePreferences as express.RequestHandler);

router.delete('/', deleteAllNotifications as express.RequestHandler);
router.delete('/:id', deleteNotification as express.RequestHandler);

export default router;
