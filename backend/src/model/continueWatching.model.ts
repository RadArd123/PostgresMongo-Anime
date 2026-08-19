import { pool } from "../config/db";
import type { ContinueWatchingItem } from "../interfaces/continueWatching.types";

export const continueWatchingModel = {
  addOrUpdate: async (
    userId: number,
    animeId: number,
    episodeId: number,
    progressSeconds: number = 0,
    durationSeconds: number = 1440,
    completed: boolean = false
  ): Promise<ContinueWatchingItem> => {
    // If progress is >= 85% of duration (e.g. outro reached), automatically treat as completed!
    const isCompleted = completed || (durationSeconds > 0 && progressSeconds >= durationSeconds * 0.85);
    const query = `
      INSERT INTO continue_watching (user_id, anime_id, episode_id, progress_seconds, duration_seconds, completed, last_watched)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, episode_id)
      DO UPDATE SET
        progress_seconds = EXCLUDED.progress_seconds,
        duration_seconds = EXCLUDED.duration_seconds,
        completed = EXCLUDED.completed,
        last_watched = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, animeId, episodeId, progressSeconds, durationSeconds, isCompleted]);
    return result.rows[0];
  },

  getByUserId: async (userId: number): Promise<ContinueWatchingItem[]> => {
    const query = `
      SELECT cw.*,
             a.title as anime_title,
             a.img_url_icon,
             a.img_url_banner,
             e.episode_number,
             e.title as episode_title,
             e.video_url
      FROM continue_watching cw
      JOIN animes a ON cw.anime_id = a.id
      JOIN episodes e ON cw.episode_id = e.id
      WHERE cw.user_id = $1 AND cw.completed = false AND (cw.duration_seconds = 0 OR cw.progress_seconds < cw.duration_seconds * 0.85)
      ORDER BY cw.last_watched DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  remove: async (userId: number, episodeId: number): Promise<ContinueWatchingItem> => {
    const query = `
      DELETE FROM continue_watching
      WHERE user_id = $1 AND episode_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, episodeId]);
    return result.rows[0];
  },

  markCompleted: async (userId: number, episodeId: number): Promise<ContinueWatchingItem> => {
    const query = `
      UPDATE continue_watching
      SET completed = true, last_watched = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND episode_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, episodeId]);
    return result.rows[0];
  }
};
