import { pool } from "../config/db";
import type { ChatMessage } from "../interfaces/chat.types";

export const chatModel = {
  addMessage: async (
    userId: number,
    message: string,
    animeId?: number | null
  ): Promise<ChatMessage> => {
    const query = `
      WITH inserted AS (
        INSERT INTO chat_messages (user_id, message, anime_id, created_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING *
      )
      SELECT i.*,
             u.username, p.avatar_url, CASE WHEN u.is_admin THEN 'admin' ELSE 'user' END as role,
             a.title as anime_title, a.img_url_icon, a.img_url_banner
      FROM inserted i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN animes a ON i.anime_id = a.id;
    `;
    const result = await pool.query(query, [userId, message, animeId || null]);
    return result.rows[0];
  },

  getRecentMessages: async (limit: number = 50): Promise<ChatMessage[]> => {
    const query = `
      SELECT cm.*,
             u.username, p.avatar_url, CASE WHEN u.is_admin THEN 'admin' ELSE 'user' END as role,
             a.title as anime_title, a.img_url_icon, a.img_url_banner
      FROM chat_messages cm
      JOIN users u ON cm.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN animes a ON cm.anime_id = a.id
      ORDER BY cm.created_at ASC
      LIMIT $1;
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  },

  deleteMessage: async (id: number, userId: number, isAdmin: boolean): Promise<number | null> => {
    const query = `
      DELETE FROM chat_messages
      WHERE id = $1 AND ($2 = true OR user_id = $3)
      RETURNING id;
    `;
    const result = await pool.query(query, [id, isAdmin, userId]);
    return result.rows[0] ? result.rows[0].id : null;
  }
};
