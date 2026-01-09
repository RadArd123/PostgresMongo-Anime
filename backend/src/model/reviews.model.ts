import {pool}   from "../config/db";
import {Reviews} from "../interfaces/reviews.types"

export const reviewsModel = {

    create: async(userId:number , reviewsData: Reviews):Promise<Reviews> => {

        const {anime_id, rating, comment} = reviewsData;
        const reviews = await pool.query("INSERT INTO reviews (anime_id, user_id, rating, comment) VALUES ($1 , $2, $3, $4) RETURNING *",
        [anime_id, userId, rating, comment]);

        return reviews?.rows[0];
    },
    getByAnimeId: async(animeId:number):Promise<Reviews[]> => {
        const reviews = await pool.query("SELECT * FROM reviews WHERE anime_id = $1 ORDER BY created_at DESC",[animeId]);
        return reviews?.rows
    },
    deletedById: async(userId:number |undefined, id:number):Promise<Reviews| undefined> => {
        const reviews = await pool.query("DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING*",[id, userId])
        return reviews?.rows[0];
    }
}