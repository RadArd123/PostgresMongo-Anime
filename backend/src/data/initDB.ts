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

    // 1.1 Tabela Profiles
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles(
        id SERIAL PRIMARY KEY,
        user_id INT UNIQUE NOT NULL,
        status VARCHAR(255) DEFAULT 'I love Anime',
        avatar_url TEXT DEFAULT '',
        banner_url TEXT DEFAULT '',
        bio TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user_profile FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    await pool.query(`
      ALTER TABLE profiles
      ADD COLUMN IF NOT EXISTS banner_url TEXT DEFAULT '';
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

    // 7. Tabela Hero Anime
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hero_anime(
        id SERIAL PRIMARY KEY,
        postgres_anime_id INT UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        original_title VARCHAR(255),
        description TEXT NOT NULL,
        rating DECIMAL(3,1) DEFAULT 0,
        background_image TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_hero_anime FOREIGN KEY (postgres_anime_id) REFERENCES animes(id) ON DELETE CASCADE
      );
    `);

    // 8. Tabela Suggested Anime
    await pool.query(`
      CREATE TABLE IF NOT EXISTS suggested_anime(
        id SERIAL PRIMARY KEY,
        postgres_anime_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        rating DECIMAL(3,1),
        views_count VARCHAR(50),
        badge_label VARCHAR(50) DEFAULT 'Trending',
        poster_image TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_suggested_anime FOREIGN KEY (postgres_anime_id) REFERENCES animes(id) ON DELETE CASCADE
      );
    `);

    // 9. Tabela Anime News
    await pool.query(`
      CREATE TABLE IF NOT EXISTS anime_news(
        id SERIAL PRIMARY KEY,
        related_postgres_anime_id INT,
        title VARCHAR(255) NOT NULL,
        sub_title VARCHAR(255),
        body_text TEXT NOT NULL,
        background_image TEXT NOT NULL,
        tags TEXT[],
        publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        overlay_rating DECIMAL(3,1),
        overlay_views_text VARCHAR(50),
        CONSTRAINT fk_news_anime FOREIGN KEY (related_postgres_anime_id) REFERENCES animes(id) ON DELETE SET NULL
      );
    `);

 
    // 10. Tabela User Activity (heatmap tracking)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_activity(
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
        count INT DEFAULT 1,
        CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT uq_user_visit UNIQUE(user_id, visit_date)
      );
    `);

    // 11. Tabela Continue Watching (unfinished episodes progress tracking)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS continue_watching(
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        anime_id INT NOT NULL,
        episode_id INT NOT NULL,
        progress_seconds INT DEFAULT 0,
        duration_seconds INT DEFAULT 1440,
        completed BOOLEAN DEFAULT FALSE,
        last_watched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_cw_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_cw_anime FOREIGN KEY (anime_id) REFERENCES animes(id) ON DELETE CASCADE,
        CONSTRAINT fk_cw_episode FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE,
        CONSTRAINT uq_user_episode UNIQUE(user_id, episode_id)
      );
    `);

    // 12. Tabela Chat Messages (Global live community chat)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_messages(
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        anime_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_chat_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_chat_anime FOREIGN KEY (anime_id) REFERENCES animes(id) ON DELETE SET NULL
      );
    `);

    // 13. Tabela Donations
    await pool.query(`
      CREATE TABLE IF NOT EXISTS donations(
        id SERIAL PRIMARY KEY,
        user_id INT,
        tier_name VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        coffees INT DEFAULT 1,
        donor_name VARCHAR(100),
        message TEXT,
        stripe_session_id VARCHAR(255),
        stripe_event_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_donation_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Existing databases may predate anonymous Stripe donations and idempotency fields.
    await pool.query(`ALTER TABLE donations ALTER COLUMN user_id DROP NOT NULL;`);
    await pool.query(`ALTER TABLE donations ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255);`);
    await pool.query(`ALTER TABLE donations ADD COLUMN IF NOT EXISTS stripe_event_id VARCHAR(255);`);
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_donations_stripe_session ON donations(stripe_session_id);`);
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_donations_stripe_event ON donations(stripe_event_id);`);

    // 14. Tabela Badges (insigne acordate de admin)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS badges(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        icon_url TEXT,
        color VARCHAR(7) DEFAULT '#FFD700',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 15. Tabela User Badges (insigne primite de useri)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_badges(
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        badge_id INT NOT NULL,
        awarded_by INT,
        awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_ub_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_ub_badge FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
        CONSTRAINT fk_ub_awarded_by FOREIGN KEY (awarded_by) REFERENCES users(id) ON DELETE SET NULL,
        CONSTRAINT uq_user_badge UNIQUE(user_id, badge_id)
      );
    `);

    // 16. Tabela Notifications (centrul de notificari)
    await pool.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'notification_type' AND n.nspname = current_schema()) THEN
          CREATE TYPE notification_type AS ENUM (
            'new_episode',
            'admin_message',
            'donation_thanks',
            'badge_awarded',
            'chat_mention',
            'system'
          );
        END IF;
      END $$;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INT NOT NULL,
        type notification_type NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        action_url VARCHAR(500),
        image_url VARCHAR(500),
        anime_id INT,
        sender_id INT,
        badge_id INT,
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        read_at TIMESTAMP WITH TIME ZONE,
        CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_notif_anime FOREIGN KEY (anime_id) REFERENCES animes(id) ON DELETE SET NULL,
        CONSTRAINT fk_notif_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
        CONSTRAINT fk_notif_badge FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE SET NULL
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_notif_user_unread ON notifications(user_id, is_read) WHERE is_deleted = FALSE;
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_notif_created ON notifications(created_at DESC);
    `);

    // 17. Tabela Anime Subscriptions (clopotelul de pe pagina anime)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS anime_subscriptions(
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        anime_id INT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_sub_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_sub_anime FOREIGN KEY (anime_id) REFERENCES animes(id) ON DELETE CASCADE,
        CONSTRAINT uq_user_anime_sub UNIQUE(user_id, anime_id)
      );
    `);

    // 18. Tabela Notification Preferences (setari per user)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notification_preferences(
        user_id INT PRIMARY KEY,
        notify_new_episode BOOLEAN NOT NULL DEFAULT TRUE,
        notify_admin_msg BOOLEAN NOT NULL DEFAULT TRUE,
        notify_badge BOOLEAN NOT NULL DEFAULT TRUE,
        notify_mention BOOLEAN NOT NULL DEFAULT TRUE,
        notify_system BOOLEAN NOT NULL DEFAULT TRUE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_pref_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Error initializing database", err); 
    throw err;
  }
};
