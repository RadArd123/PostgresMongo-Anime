import { pool } from '../config/db';
import { Badge, UserBadge } from '../interfaces/badges.types';

export const badgeModel = {
  // Create a new badge (admin only)
  create: async (name: string, description: string, iconUrl: string, color: string): Promise<Badge> => {
    const { rows } = await pool.query(
      `INSERT INTO badges (name, description, icon_url, color)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description || null, iconUrl || null, color || '#FFD700']
    );
    return rows[0];
  },

  // Get all badges
  getAll: async (): Promise<Badge[]> => {
    const { rows } = await pool.query(`SELECT * FROM badges ORDER BY created_at DESC`);
    return rows;
  },

  // Delete a badge
  delete: async (id: number): Promise<boolean> => {
    const { rowCount } = await pool.query(`DELETE FROM badges WHERE id = $1`, [id]);
    return (rowCount ?? 0) > 0;
  },

  // Award a badge to a user (admin only)
  award: async (userId: number, badgeId: number, awardedBy: number): Promise<UserBadge | null> => {
    const { rows } = await pool.query(
      `INSERT INTO user_badges (user_id, badge_id, awarded_by)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, badge_id) DO NOTHING
       RETURNING *`,
      [userId, badgeId, awardedBy]
    );
    return rows[0] || null; // null = user already has this badge
  },

  // Get all badges for a specific user
  getByUserId: async (userId: number): Promise<UserBadge[]> => {
    const { rows } = await pool.query(
      `SELECT ub.*,
              b.name        AS badge_name,
              b.description AS badge_description,
              b.icon_url    AS badge_icon_url,
              b.color       AS badge_color,
              u.username    AS awarded_by_username
       FROM user_badges ub
       JOIN badges b ON ub.badge_id = b.id
       LEFT JOIN users u ON ub.awarded_by = u.id
       WHERE ub.user_id = $1
       ORDER BY ub.awarded_at DESC`,
      [userId]
    );
    return rows;
  },

  // Check if anime subscription exists
  isSubscribed: async (userId: number, animeId: number): Promise<boolean> => {
    const { rows } = await pool.query(
      `SELECT 1 FROM anime_subscriptions WHERE user_id = $1 AND anime_id = $2`,
      [userId, animeId]
    );
    return rows.length > 0;
  },

  // Subscribe to anime notifications
  subscribeToAnime: async (userId: number, animeId: number): Promise<void> => {
    await pool.query(
      `INSERT INTO anime_subscriptions (user_id, anime_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [userId, animeId]
    );
  },

  // Unsubscribe from anime notifications
  unsubscribeFromAnime: async (userId: number, animeId: number): Promise<void> => {
    await pool.query(
      `DELETE FROM anime_subscriptions WHERE user_id = $1 AND anime_id = $2`,
      [userId, animeId]
    );
  },
};
