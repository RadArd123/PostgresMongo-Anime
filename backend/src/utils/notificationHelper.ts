import { pool } from '../config/db';
import { Server } from 'socket.io';

export type NotificationType =
  | 'new_episode'
  | 'admin_message'
  | 'donation_thanks'
  | 'badge_awarded'
  | 'chat_mention'
  | 'system';

export interface CreateNotificationPayload {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string | null;
  imageUrl?: string | null;
  animeId?: number | null;
  senderId?: number | null;
  badgeId?: number | null;
}

/**
 * Creates a notification in the database and emits it in real-time
 * via Socket.io to the target user's private room.
 */
export const createNotification = async (
  io: Server,
  payload: CreateNotificationPayload
) => {
  const {
    userId,
    type,
    title,
    message,
    actionUrl = null,
    imageUrl = null,
    animeId = null,
    senderId = null,
    badgeId = null,
  } = payload;

  const preferenceByType = {
    new_episode: 'notify_new_episode', admin_message: 'notify_admin_msg', donation_thanks: 'notify_admin_msg',
    badge_awarded: 'notify_badge', chat_mention: 'notify_mention', system: 'notify_system',
  } as const;
  const preference = preferenceByType[type];
  const { rows: preferences } = await pool.query(`SELECT ${preference} AS enabled FROM notification_preferences WHERE user_id = $1`, [userId]);
  if (preferences[0]?.enabled === false) return null;

  const result = await pool.query(
    `INSERT INTO notifications
       (user_id, type, title, message, action_url, image_url, anime_id, sender_id, badge_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [userId, type, title, message, actionUrl, imageUrl, animeId, senderId, badgeId]
  );

  const notif = result.rows[0];

  // Emit real-time to user's private room
  try {
    io.to(`user:${userId}`).emit('new_notification', notif);
  } catch (err) {
    console.warn('Socket notification emit error:', err);
  }

  return notif;
};

/**
 * Sends a notification to ALL subscribers of a specific anime.
 * Respects per-user notify_new_episode preference.
 */
export const notifyAnimeSubscribers = async (
  io: Server,
  animeId: number,
  payload: Omit<CreateNotificationPayload, 'userId'>
) => {
  // Get all subscribers who have new_episode notifications enabled
  const { rows: subscribers } = await pool.query(
    `SELECT s.user_id
     FROM anime_subscriptions s
     LEFT JOIN notification_preferences p ON s.user_id = p.user_id
     WHERE s.anime_id = $1
       AND (p.notify_new_episode IS NULL OR p.notify_new_episode = TRUE)`,
    [animeId]
  );

  const results = await Promise.allSettled(
    subscribers.map((sub: { user_id: number }) =>
      createNotification(io, { ...payload, userId: sub.user_id, animeId })
    )
  );

  return results;
};
