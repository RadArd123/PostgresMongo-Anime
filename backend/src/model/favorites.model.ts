import { pool } from "../config/db";
import { Favorites } from "../interfaces/favorites.types";
import {FavoriteAnime} from "../interfaces/anime.types";

export const favoritesModel = {
  add: async (userId: number, animeId: number): Promise<Favorites> => {
    const existingFavorites = await pool.query<Favorites>(
      "SELECT * FROM favorites WHERE user_id = $1 AND anime_id = $2 ",
      [userId, animeId]
    );
    if (existingFavorites.rows.length > 0) {
      throw new Error("Favorites already selected");
    }
    const addFavorites = await pool.query<Favorites>(
      `INSERT INTO favorites (user_id, anime_id) 
             VALUES ($1, $2)
             RETURNING *`,
      [userId, animeId]
    );
    return addFavorites?.rows[0];
  },
  getFavoritesByUser: async (userId: number): Promise<FavoriteAnime[]> => {
    const query = `
      SELECT 
        animes.*, 
        favorites.added_at 
      FROM animes
      INNER JOIN favorites ON animes.id = favorites.anime_id
      WHERE favorites.user_id = $1
    `;

    const result = await pool.query<FavoriteAnime>(query, [userId]);
    return result.rows;
  },
  delete: async (userId: number, animeId: number): Promise<Favorites[]> => {
    const deletedFavorites = await pool.query<Favorites>(
      `
        DELETE FROM favorites
        WHERE user_id = $1 AND anime_id = $2
        RETURNING *
    `,
      [userId, animeId]
    );
    if (deletedFavorites.rows.length === 0) {
      return [];
    }
    return deletedFavorites?.rows;
  },
};
