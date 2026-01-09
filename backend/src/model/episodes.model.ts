import {pool} from "../config/db";
import {Episode} from "../interfaces/episodes.types";

export const episodeModel = {
    createEpisode: async (episode: Episode): Promise<Episode> => {
        const {anime_id, title, duration, episode_number, video_url} = episode;
        const createEpisode =  await pool.query<Episode>(
            `INSERT INTO episodes (anime_id, title, duration, episode_number, video_url)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`, 
             [anime_id, title, duration, episode_number, video_url]
        );
        const newEpisode = createEpisode?.rows[0];
        return newEpisode;
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
    }
}