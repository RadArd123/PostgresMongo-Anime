import { Response } from 'express';
import { ExtendedRequest } from '../interfaces/request.types';
import { notificationModel } from '../model/notification.model';

// GET /api/notifications?page=1&limit=30
export const getNotifications = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    const offset = (page - 1) * limit;

    const notifications = await notificationModel.getByUserId(req.user.id, limit, offset);
    const unreadCount = await notificationModel.countUnread(req.user.id);

    res.status(200).json({ notifications, unreadCount });
  } catch (err) {
    console.error('getNotifications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/notifications/unread-count
export const getUnreadCount = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const count = await notificationModel.countUnread(req.user.id);
    res.status(200).json({ count });
  } catch (err) {
    console.error('getUnreadCount error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/notifications/:id/read
export const markAsRead = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const notif = await notificationModel.markAsRead(id, req.user.id);
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json({ notification: notif });
  } catch (err) {
    console.error('markAsRead error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/notifications/read-all
export const markAllAsRead = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    await notificationModel.markAllAsRead(req.user.id);
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('markAllAsRead error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const deleted = await notificationModel.softDelete(id, req.user.id);
    if (!deleted) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json({ message: 'Notification deleted' });
  } catch (err) {
    console.error('deleteNotification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/notifications
export const deleteAllNotifications = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    await notificationModel.softDeleteAll(req.user.id);
    res.status(200).json({ message: 'All notifications deleted' });
  } catch (err) {
    console.error('deleteAllNotifications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/notifications/preferences
export const getPreferences = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const prefs = await notificationModel.getPreferences(req.user.id);
    res.status(200).json({ preferences: prefs });
  } catch (err) {
    console.error('getPreferences error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/notifications/preferences
export const updatePreferences = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const { notify_new_episode, notify_admin_msg, notify_badge, notify_mention, notify_system } = req.body;
    const updated = await notificationModel.updatePreferences(req.user.id, {
      notify_new_episode,
      notify_admin_msg,
      notify_badge,
      notify_mention,
      notify_system,
    });
    res.status(200).json({ preferences: updated });
  } catch (err) {
    console.error('updatePreferences error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
