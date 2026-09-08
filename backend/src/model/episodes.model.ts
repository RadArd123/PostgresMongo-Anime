import {pool} from "../config/db";
import {Episode, LatestEpisode} from "../interfaces/episodes.types";

export const episodeModel = {
    createEpisode: async (episode: Episode): Promise<Episode> => {
        const {anime_id, title, duration, episode_number, video_url} = episode;
        const client = await pool.connect();
        try {
        await client.query('BEGIN');
        await client.query('SELECT id FROM animes WHERE id = $1 FOR UPDATE', [anime_id]);
        const existing = await client.query('SELECT id FROM episodes WHERE anime_id = $1 AND episode_number = $2', [anime_id, episode_number]);
        if (existing.rows.length) throw Object.assign(new Error('Episode number already exists'), { code: '23505' });
        const createEpisode = await client.query<Episode>(
            `INSERT INTO episodes (anime_id, title, duration, episode_number, video_url)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`, 
             [anime_id, title, duration, episode_number, video_url]
        );
        const newEpisode = createEpisode?.rows[0];
        await client.query('COMMIT');
        return newEpisode;
        } catch (error) { await client.query('ROLLBACK'); throw error; }
        finally { client.release(); }
    },
    getLatestEpisodes: async (limit: number, offset: number): Promise<LatestEpisode[]> => {
        const query = `
            SELECT 
                e.id, 
                e.anime_id, 
                e.title, 
                e.duration, 
                e.episode_number, 
                e.video_url, 
                e.created_at,
                a.title as anime_title, 
                a.img_url_icon
            FROM episodes e
            JOIN animes a ON e.anime_id = a.id
            ORDER BY e.created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const result = await pool.query<LatestEpisode>(query, [limit, offset]);
        return result.rows || [];
    },
    getEpisodesByAnimeId: async (animeId: number): Promise<Episode[] | null> => {
        const getEpisode = await pool.query<Episode>(
            "SELECT * FROM episodes WHERE anime_id = $1 ORDER BY episode_number ASC", [animeId]
        )
        return getEpisode?.rows;
    },
    deleteEpisode: async ( id:number): Promise<Episode[] | null> => {
        const deleteEpisode = await pool.query<Episode>(
            "DELETE FROM episodes WHERE id = $1  RETURNING *", [id]
        );
        if (deleteEpisode.rows.length === 0) {
            return null; 
        }
        const deletedEpisode = deleteEpisode?.rows[0];
        return [deletedEpisode];
    },
    getEpisodeById: async (id: number): Promise<Episode | null> => {
        const getEpisode = await pool.query<Episode>("SELECT * FROM episodes WHERE id = $1", [id]);
        if (getEpisode.rows.length === 0) {
            return null; 
        }
        const episode = getEpisode?.rows[0];
        return episode;
    },
    updateEpisode: async (id: number, episode: Partial<Episode>): Promise<Episode | null> => {
        const { title, duration, episode_number, video_url } = episode;
        const client = await pool.connect();
        try {
        await client.query('BEGIN');
        const existing = await client.query('SELECT anime_id FROM episodes WHERE id = $1', [id]);
        if (!existing.rows[0]) { await client.query('ROLLBACK'); return null; }
        await client.query('SELECT id FROM animes WHERE id = $1 FOR UPDATE', [existing.rows[0].anime_id]);
        if (episode_number !== undefined) {
            const duplicate = await client.query('SELECT id FROM episodes WHERE anime_id = $1 AND episode_number = $2 AND id <> $3', [existing.rows[0].anime_id, episode_number, id]);
            if (duplicate.rows.length) throw Object.assign(new Error('Episode number already exists'), { code: '23505' });
        }
        const updateQuery = await client.query<Episode>(
            `UPDATE episodes 
             SET title = COALESCE($1, title),
                 duration = CASE WHEN $6 THEN $2 ELSE duration END,
                 episode_number = COALESCE($3, episode_number),
                 video_url = COALESCE($4, video_url)
             WHERE id = $5
             RETURNING *`,
            [title, duration, episode_number, video_url, id, Object.prototype.hasOwnProperty.call(episode, 'duration')]
        );
        await client.query('COMMIT');
        if (updateQuery.rows.length === 0) {
            return null;
        }
        return updateQuery.rows[0];
        } catch (error) { await client.query('ROLLBACK'); throw error; }
        finally { client.release(); }
    }
}
