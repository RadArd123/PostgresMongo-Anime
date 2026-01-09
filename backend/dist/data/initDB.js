"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = void 0;
const db_1 = require("../config/db");
const initDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Tabela Users
        yield db_1.pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // 2. Tabela Animes
        yield db_1.pool.query(`
      CREATE TABLE IF NOT EXISTS animes(
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        genre VARCHAR(100),
        release_year INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        yield db_1.pool.query(`
      ALTER TABLE animes
      ADD COLUMN IF NOT EXISTS img_url_icon TEXT NOT NULL,
      ADD COLUMN IF NOT EXISTS img_url_banner TEXT NOT NULL;
    `);
        // 3. Tabela Episodes
        yield db_1.pool.query(`
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
        yield db_1.pool.query(`
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
        yield db_1.pool.query(`
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
        yield db_1.pool.query(`
      CREATE TABLE IF NOT EXISTS favorites(
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        anime_id INT NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        CONSTRAINT fk_user_favorite FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT fk_anime_favorite FOREIGN KEY (anime_id) REFERENCES animes(id)
      );
    `);
        console.log("Database initialized successfully");
    }
    catch (err) {
        console.error("Error initializing database", err);
    }
});
exports.initDB = initDB;
