import {pool} from "../config/db";
import type { WatchlistAnime } from "../interfaces/anime.types";
import {Watchlists} from "../interfaces/watchlists.types"
 

export const watchlistsModel= {
    add: async (userId:number | undefined, animeId:number):Promise<Watchlists> => {
        const watchlist = await pool.query("INSERT INTO watchlists (user_id, anime_id) VALUES ($1, $2)  RETURNING anime_id",[userId, animeId]);
        return watchlist.rows[0];
    },
    getById: async (userId: number | undefined):Promise<WatchlistAnime[]> => {
        const watchlist = await pool.query("SELECT animes.*,watchlists.added_at FROM animes INNER JOIN watchlists ON animes.id = watchlists.anime_id WHERE watchlists.user_id = $1",[userId]);
        return watchlist.rows
    },
    remove: async (userId: number | undefined, animeId: number):Promise<Watchlists> => {
        const watchlist = await pool.query("DELETE FROM watchlists WHERE user_id = $1 AND anime_id = $2 RETURNING anime_id",[userId, animeId]);
        return watchlist.rows[0];
    }
}