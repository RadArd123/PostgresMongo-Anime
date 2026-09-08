import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined;

export const pool = new Pool(
  connectionString
    ? { connectionString, ssl }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl,
      }
);
