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
      
        const deleteAnime = await pool.query<Anime>("DELETE FROM animes WHERE id = $1 RETURNING *", [id]);
        if(deleteAnime.rows.length === 0){
            throw new Error("Anime not found");
        }
        return deleteAnime?.rows[0];
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
        if(updatedAnime.rows.length === 0){
            throw new Error("Anime not found");
        }
        return updatedAnime?.rows[0];
    }
}