import { pool } from '../src/config/db';

async function queryDB() {
    try {
        const res = await pool.query('SELECT * FROM user_activity');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}
queryDB();
