import { Response } from 'express';
import { ExtendedRequest } from '../interfaces/request.types';
import { badgeModel } from '../model/badge.model';
import { createNotification } from '../utils/notificationHelper';
import { getIO } from '../config/socket';

// ─── BADGES ──────────────────────────────────────────────

// GET /api/badges — toate badge-urile (public)
export const getAllBadges = async (req: ExtendedRequest, res: Response) => {
  try {
    const badges = await badgeModel.getAll();
    res.status(200).json({ badges });
  } catch (err) {
    console.error('getAllBadges error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/badges/user/:userId — badge-urile unui user
export const getUserBadges = async (req: ExtendedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const badges = await badgeModel.getByUserId(Number(userId));
    res.status(200).json({ badges });
  } catch (err) {
    console.error('getUserBadges error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/badges — creează badge nou (admin)
export const createBadge = async (req: ExtendedRequest, res: Response) => {
  try {
    const { name, description, icon_url, color } = req.body;
    if (!name) return res.status(400).json({ message: 'Badge name is required' });

    const badge = await badgeModel.create(name, description, icon_url, color);
    res.status(201).json({ message: 'Badge created', badge });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'A badge with this name already exists' });
    }
    console.error('createBadge error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/badges/:id — șterge badge (admin)
export const deleteBadge = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await badgeModel.delete(Number(id));
    if (!deleted) return res.status(404).json({ message: 'Badge not found' });
    res.status(200).json({ message: 'Badge deleted' });
  } catch (err) {
    console.error('deleteBadge error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/badges/award — acordă badge unui user + trimite notificare (admin)
export const awardBadge = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { userId, badgeId, customMessage } = req.body;
    if (!userId || !badgeId) {
      return res.status(400).json({ message: 'userId and badgeId are required' });
    }

    const userBadge = await badgeModel.award(Number(userId), Number(badgeId), req.user.id);
    if (!userBadge) {
      return res.status(409).json({ message: 'User already has this badge' });
    }

    // Trimite notificare real-time
    const allBadges = await badgeModel.getAll();
    const badge = allBadges.find((b) => b.id === Number(badgeId));

    await createNotification(getIO(), {
      userId: Number(userId),
      type: 'badge_awarded',
      title: `Ai primit insigna "${badge?.name}"! 🏅`,
      message: customMessage || `Felicitări! Adminul ți-a acordat insigna "${badge?.name}".`,
      imageUrl: badge?.icon_url || null,
      badgeId: Number(badgeId),
      senderId: req.user.id,
    });

    res.status(201).json({ message: 'Badge awarded successfully', userBadge });
  } catch (err) {
    console.error('awardBadge error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── ANIME SUBSCRIPTIONS ─────────────────────────────────

// GET /api/badges/subscriptions/:animeId — verifică dacă e abonat
export const checkSubscription = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const { animeId } = req.params;
    const isSubscribed = await badgeModel.isSubscribed(req.user.id, Number(animeId));
    res.status(200).json({ isSubscribed });
  } catch (err) {
    console.error('checkSubscription error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/badges/subscriptions/:animeId — activează notificări
export const subscribeToAnime = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const { animeId } = req.params;
    await badgeModel.subscribeToAnime(req.user.id, Number(animeId));
    res.status(200).json({ message: 'Subscribed to anime notifications', isSubscribed: true });
  } catch (err) {
    console.error('subscribeToAnime error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/badges/subscriptions/:animeId — dezactivează notificări
export const unsubscribeFromAnime = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const { animeId } = req.params;
    await badgeModel.unsubscribeFromAnime(req.user.id, Number(animeId));
    res.status(200).json({ message: 'Unsubscribed from anime notifications', isSubscribed: false });
  } catch (err) {
    console.error('unsubscribeFromAnime error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── ADMIN: SEND CUSTOM MESSAGE ──────────────────────────

// POST /api/badges/admin/message — trimite mesaj admin unui user
export const sendAdminMessage = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { userId, title, message, type = 'admin_message' } = req.body;
    if (!userId || !title || !message) {
      return res.status(400).json({ message: 'userId, title and message are required' });
    }

    const validTypes = ['admin_message', 'donation_thanks', 'system'];
    const notifType = validTypes.includes(type) ? type : 'admin_message';

    await createNotification(getIO(), {
      userId: Number(userId),
      type: notifType as any,
      title,
      message,
      senderId: req.user.id,
    });

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (err) {
    console.error('sendAdminMessage error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/badges/admin/broadcast — trimite notificare tuturor userilor
export const broadcastSystemNotification = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: 'title and message are required' });
    }

    const { pool } = await import('../config/db');
    const { rows: users } = await pool.query(
      `SELECT id FROM users WHERE id != $1`,
      [req.user.id]
    );

    const results = await Promise.allSettled(
      users.map((u: { id: number }) =>
        createNotification(getIO(), {
          userId: u.id,
          type: 'system',
          title,
          message,
          senderId: req.user!.id,
        })
      )
    );

    const sent = results.filter(result => result.status === 'fulfilled' && result.value !== null).length;
    const failed = results.filter(result => result.status === 'rejected').length;
    res.status(200).json({ message: `Broadcast delivered to ${sent} users${failed ? `; ${failed} deliveries failed` : ''}`, sent, failed });
  } catch (err) {
    console.error('broadcastSystemNotification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
