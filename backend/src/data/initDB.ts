import { pool } from "../config/db";

export const initDB = async () => {
  try {

    // 1. Tabela Users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Tabela Animes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS animes(
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        genre VARCHAR(100),
        release_year INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      ALTER TABLE animes
      ADD COLUMN IF NOT EXISTS img_url_icon TEXT NOT NULL,
      ADD COLUMN IF NOT EXISTS img_url_banner TEXT NOT NULL;
    `);

    // 3. Tabela Episodes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS episodes(
        id SERIAL PRIMARY KEY,
        anime_id INT NOT NULL,
        episode_number INT NOT NULL,
        video_url TEXT NOT NULL,
        title VARCHAR(200),
        duration INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_anime_episode FOREIGN KEY (anime_id) REFERENCES animes(id)
      );
    `);

    // 4. Tabela Reviews
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews(
        id SERIAL PRIMARY KEY,
        anime_id INT NOT NULL,
        user_id INT NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT fk_anime_review FOREIGN KEY (anime_id) REFERENCES animes(id),
        CONSTRAINT fk_user_review FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // 5. Tabela Watchlists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS watchlists(
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        anime_id INT NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user_watchlist FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT fk_anime_watchlist FOREIGN KEY (anime_id) REFERENCES animes(id)
      );
    `);

    // 6. Tabela Favorites
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites(
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        anime_id INT NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        CONSTRAINT fk_user_favorite FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT fk_anime_favorite FOREIGN KEY (anime_id) REFERENCES animes(id)
      );
    `);
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
      `)

 
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Error initializing database", err); 
  }
};