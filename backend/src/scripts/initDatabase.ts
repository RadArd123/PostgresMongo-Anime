import 'dotenv/config';
import { pool } from '../config/db';
import { initDB } from '../data/initDB';

const run = async () => {
  try {
    await initDB();
  } finally {
    await pool.end();
  }
};

run().catch((error) => {
  console.error('Database initialization failed:', error);
  process.exitCode = 1;
});
