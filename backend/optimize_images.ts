import { pool } from './src/config/db';

async function optimizeImages() {
    try {
        console.log("Starting DB image optimization...");
        
        await pool.query(`UPDATE hero_anime SET background_image = REPLACE(background_image, '/upload/', '/upload/f_auto,q_auto/') WHERE background_image LIKE '%res.cloudinary.com%/upload/%' AND background_image NOT LIKE '%f_auto,q_auto%'`);
        console.log("Updated hero_anime");

        await pool.query(`UPDATE suggested_anime SET poster_image = REPLACE(poster_image, '/upload/', '/upload/f_auto,q_auto/') WHERE poster_image LIKE '%res.cloudinary.com%/upload/%' AND poster_image NOT LIKE '%f_auto,q_auto%'`);
        console.log("Updated suggested_anime");

        await pool.query(`UPDATE anime_news SET background_image = REPLACE(background_image, '/upload/', '/upload/f_auto,q_auto/') WHERE background_image LIKE '%res.cloudinary.com%/upload/%' AND background_image NOT LIKE '%f_auto,q_auto%'`);
        console.log("Updated anime_news");

        await pool.query(`UPDATE profiles SET avatar_url = REPLACE(avatar_url, '/upload/', '/upload/f_auto,q_auto/') WHERE avatar_url LIKE '%res.cloudinary.com%/upload/%' AND avatar_url NOT LIKE '%f_auto,q_auto%'`);
        console.log("Updated profiles avatar_url");

        await pool.query(`UPDATE profiles SET banner_url = REPLACE(banner_url, '/upload/', '/upload/f_auto,q_auto/') WHERE banner_url LIKE '%res.cloudinary.com%/upload/%' AND banner_url NOT LIKE '%f_auto,q_auto%'`);
        console.log("Updated profiles banner_url");

        console.log("Optimization complete!");
        process.exit(0);
    } catch (err) {
        console.error("Error running optimization:", err);
        process.exit(1);
    }
}

optimizeImages();
