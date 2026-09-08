import { pool } from '../config/db';
import { Notification, NotificationPreferences } from '../interfaces/notifications.types';

export const notificationModel = {
  // Get paginated notifications for a user (with joined data)
  getByUserId: async (userId: number, limit = 30, offset = 0): Promise<Notification[]> => {
    const { rows } = await pool.query(
      `SELECT n.*,
              u.username  AS sender_username,
              p.avatar_url AS sender_avatar,
              a.title     AS anime_title,
              b.name      AS badge_name,
              b.color     AS badge_color,
              b.icon_url  AS badge_icon_url
       FROM notifications n
       LEFT JOIN users    u ON n.sender_id = u.id
       LEFT JOIN profiles p ON u.id = p.user_id
       LEFT JOIN animes   a ON n.anime_id  = a.id
       LEFT JOIN badges   b ON n.badge_id  = b.id
       WHERE n.user_id = $1 AND n.is_deleted = FALSE
       ORDER BY n.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return rows;
  },

  // Count unread notifications
  countUnread: async (userId: number): Promise<number> => {
    const { rows } = await pool.query(
      `SELECT COUNT(*) FROM notifications
       WHERE user_id = $1 AND is_read = FALSE AND is_deleted = FALSE`,
      [userId]
    );
    return parseInt(rows[0].count, 10);
  },

  // Mark one as read
  markAsRead: async (id: string, userId: number): Promise<Notification | null> => {
    const { rows } = await pool.query(
      `UPDATE notifications
       SET is_read = TRUE, read_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );
    return rows[0] || null;
  },

  // Mark all as read
  markAllAsRead: async (userId: number): Promise<void> => {
    await pool.query(
      `UPDATE notifications
       SET is_read = TRUE, read_at = NOW()
       WHERE user_id = $1 AND is_read = FALSE AND is_deleted = FALSE`,
      [userId]
    );
  },

  // Soft delete one notification
  softDelete: async (id: string, userId: number): Promise<boolean> => {
    const { rowCount } = await pool.query(
      `UPDATE notifications SET is_deleted = TRUE
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return (rowCount ?? 0) > 0;
  },

  // Soft delete all for user
  softDeleteAll: async (userId: number): Promise<void> => {
    await pool.query(
      `UPDATE notifications SET is_deleted = TRUE WHERE user_id = $1`,
      [userId]
    );
  },

  // Get or create preferences for user
  getPreferences: async (userId: number): Promise<NotificationPreferences> => {
    await pool.query(
      `INSERT INTO notification_preferences (user_id) VALUES ($1) ON CONFLICT DO NOTHING`,
      [userId]
    );
    const { rows } = await pool.query(
      `SELECT * FROM notification_preferences WHERE user_id = $1`,
      [userId]
    );
    return rows[0];
  },

  // Update preferences
  updatePreferences: async (
    userId: number,
    prefs: Partial<Omit<NotificationPreferences, 'user_id'>>
  ): Promise<NotificationPreferences> => {
    await pool.query('INSERT INTO notification_preferences (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [userId]);
    const allowed = ['notify_new_episode', 'notify_admin_msg', 'notify_badge', 'notify_mention', 'notify_system'] as const;
    const fields = allowed.filter(field => typeof prefs[field] === 'boolean');
    if (!fields.length) return notificationModel.getPreferences(userId);
    const setClauses = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const values = fields.map((f) => prefs[f]);

    const { rows } = await pool.query(
      `UPDATE notification_preferences
       SET ${setClauses}, updated_at = NOW()
       WHERE user_id = $1
       RETURNING *`,
      [userId, ...values]
    );
    return rows[0];
  },
};
