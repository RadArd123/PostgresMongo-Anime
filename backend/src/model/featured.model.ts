import { pool } from "../config/db";

export const createHeroAnime = async (postgres_anime_id: number, title: string, description: string, original_title: string | null, rating: number, imageUrl: string) => {
    const result = await pool.query(
        `INSERT INTO hero_anime (postgres_anime_id, title, description, original_title, rating, background_image)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [postgres_anime_id, title, description, original_title, rating, imageUrl]
    );
    return result.rows[0];
};

export const fetchHeroAnimes = async () => {
    const result = await pool.query('SELECT * FROM hero_anime ORDER BY created_at DESC');
    return result.rows;
};

export const deleteHeroAnime = async (id: string) => {
    const result = await pool.query('DELETE FROM hero_anime WHERE id = $1 RETURNING *', [id]);
    return result.rowCount;
};

export const createSuggestedAnime = async (postgres_anime_id: number, title: string, description: string | null, views_count: string | null, rating: number | null, badge_label: string, imageUrl: string) => {
    const result = await pool.query(
        `INSERT INTO suggested_anime (postgres_anime_id, title, description, views_count, rating, badge_label, poster_image)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
         [postgres_anime_id, title, description, views_count, rating, badge_label, imageUrl]
      );
      return result.rows[0];
};

export const fetchSuggestedAnimes = async () => {
    const result = await pool.query('SELECT * FROM suggested_anime ORDER BY created_at DESC');
    return result.rows;
};

export const deleteSuggestedAnime = async (id: string) => {
    const result = await pool.query('DELETE FROM suggested_anime WHERE id = $1 RETURNING *', [id]);
    return result.rowCount;
};

export const createAnimeNews = async (title: string, sub_title: string | null, body_text: string, imageUrl: string, tags: string[] | null, related_postgres_anime_id: number | null, rating: number | null, views_text: string | null) => {
    const result = await pool.query(
        `INSERT INTO anime_news (title, sub_title, body_text, background_image, tags, related_postgres_anime_id, overlay_rating, overlay_views_text)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
         [title, sub_title, body_text, imageUrl, tags, related_postgres_anime_id, rating, views_text]
      );
      return result.rows[0];
};

export const fetchAnimeNews = async () => {
    const result = await pool.query('SELECT * FROM anime_news ORDER BY publish_date DESC');
    return result.rows;
};

export const deleteAnimeNews = async (id: string) => {
    const result = await pool.query('DELETE FROM anime_news WHERE id = $1 RETURNING *', [id]);
    return result.rowCount;
};

export const updateHeroAnime = async (id: string, postgres_anime_id: number, title: string, description: string, original_title: string | null, rating: number) => {
    const result = await pool.query(
        `UPDATE hero_anime 
         SET postgres_anime_id = COALESCE($1, postgres_anime_id),
             title = COALESCE($2, title),
             description = COALESCE($3, description),
             original_title = COALESCE($4, original_title),
             rating = COALESCE($5, rating)
         WHERE id = $6 RETURNING *`,
        [postgres_anime_id, title, description, original_title, rating, id]
    );
    return result.rows[0];
};

export const updateSuggestedAnime = async (id: string, postgres_anime_id: number, title: string, description: string | null, views_count: string | null, rating: number | null, badge_label: string) => {
    const result = await pool.query(
        `UPDATE suggested_anime 
         SET postgres_anime_id = COALESCE($1, postgres_anime_id),
             title = COALESCE($2, title),
             description = COALESCE($3, description),
             views_count = COALESCE($4, views_count),
             rating = COALESCE($5, rating),
             badge_label = COALESCE($6, badge_label)
         WHERE id = $7 RETURNING *`,
         [postgres_anime_id, title, description, views_count, rating, badge_label, id]
    );
    return result.rows[0];
};

export const updateAnimeNews = async (id: string, title: string, sub_title: string | null, body_text: string, tags: string[] | null, related_postgres_anime_id: number | null, rating: number | null, views_text: string | null) => {
    const result = await pool.query(
        `UPDATE anime_news 
         SET title = COALESCE($1, title),
             sub_title = COALESCE($2, sub_title),
             body_text = COALESCE($3, body_text),
             tags = COALESCE($4, tags),
             related_postgres_anime_id = COALESCE($5, related_postgres_anime_id),
             overlay_rating = COALESCE($6, overlay_rating),
             overlay_views_text = COALESCE($7, overlay_views_text)
         WHERE id = $8 RETURNING *`,
         [title, sub_title, body_text, tags, related_postgres_anime_id, rating, views_text, id]
    );
    return result.rows[0];
};
