import { pool } from "../config/db"
import { Profile } from "../interfaces/profiles.types"


export const profileModel = {
    createProfile: async (user_id: number): Promise<Profile> => {
        await pool.query("INSERT INTO profiles (user_id) VALUES ($1) ON CONFLICT DO NOTHING", [user_id]);
        return (await profileModel.getProfile(user_id))!;
    },
    getProfile: async (user_id: number): Promise<Profile | null> => {
        const results = await pool.query(
            `SELECT 
                p.id as profile_id,
                p.status,
                p.avatar_url,
                p.banner_url,
                p.bio,
                p.created_at as profile_created_at,
                u.id as user_id,
                u.username,
                u.email
            FROM profiles p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = $1;
            `, [user_id]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows[0];
    },
    updateProfile: async (user_id: number, status?: string, avatar_url?: string, banner_url?: string, bio?: string): Promise<Profile> => {
        const results = await pool.query(
            `UPDATE profiles SET 
            status = COALESCE($1, status),
            avatar_url = COALESCE($2, avatar_url),
            banner_url = COALESCE($3, banner_url),
            bio = COALESCE($4, bio),
            updated_at = $5
            WHERE user_id = $6
            RETURNING *;
            `,
            [status ?? null, avatar_url ?? null, banner_url ?? null, bio ?? null, new Date(), user_id]
        )
        if (results.rows.length === 0) {
            throw new Error("Profile not found");
        }
        return (await profileModel.getProfile(user_id))!;
    },
    logActivity: async (user_id: number): Promise<void> => {
        // Only increment 1 visit per day per user (1 active day = 1 green square).
        await pool.query(
            `INSERT INTO user_activity (user_id, visit_date, count)
             VALUES ($1, CURRENT_DATE, 1)
             ON CONFLICT (user_id, visit_date)
             DO NOTHING;`,
            [user_id]
        );
    },
    getUserActivity: async (user_id: number): Promise<{ date: string; count: number }[]> => {
        // Normalize any old test records where count > 1 to 1 so each active day shows exactly 1 visit
        await pool.query("UPDATE user_activity SET count = 1 WHERE count > 1");
        const results = await pool.query(
            `SELECT TO_CHAR(visit_date, 'YYYY-MM-DD') as date, count
             FROM user_activity
             WHERE user_id = $1 AND visit_date >= CURRENT_DATE - INTERVAL '365 days'
             ORDER BY visit_date ASC;`,
            [user_id]
        );
        return results.rows;
    }
}