import {pool}   from "../config/db";
import { Anime } from "../interfaces/anime.types";

export const animeModel = {

    createAnime: async (animeData: Anime): Promise<Anime> => {
        
        const {title, description, genre, release_year, img_url_icon, img_url_banner } = animeData;
        const newAnime = await pool.query<Anime>(
            `INSERT INTO animes (title, description, genre, release_year, img_url_icon, img_url_banner) 
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [title, description, genre, release_year, img_url_icon, img_url_banner]
        );
            return newAnime?.rows[0];
    },
    getAnimes: async (): Promise<Anime[]> => {
        
        const animes = await pool.query<Anime>("SELECT * FROM animes ORDER BY created_at DESC");
        return animes.rows;     
    },
    getAnimeById: async (id: number): Promise<Anime | null> => {
        
        const anime = await pool.query<Anime>("SELECT * FROM animes WHERE id = $1", [id]);
        if(anime.rows.length === 0){
            return null;
        }
        return anime?.rows[0];       
    },
    deleteAnime: async (id: number): Promise<Anime> => {
      
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const existing = await client.query<Anime>('SELECT * FROM animes WHERE id = $1 FOR UPDATE', [id]);
            if (!existing.rows[0]) throw new Error('Anime not found');
            // Legacy databases have non-cascading foreign keys on these tables.
            for (const table of ['reviews', 'favorites', 'watchlists', 'episodes']) {
                await client.query(`DELETE FROM ${table} WHERE anime_id = $1`, [id]);
            }
            await client.query('DELETE FROM animes WHERE id = $1', [id]);
            await client.query('COMMIT');
            return existing.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally { client.release(); }
    },
    updateAnime: async (id: number, animeData: Anime): Promise<Anime> => {
        const {title, description, genre, release_year } = animeData;
        const updatedAnime = await pool.query<Anime>(
            `UPDATE animes 
             SET title = $1, description = $2, genre = $3, release_year = $4
             WHERE id = $5
             RETURNING *`,
            [title, description, genre, release_year, id]
        );
        return updatedAnime?.rows[0];
    }
}
