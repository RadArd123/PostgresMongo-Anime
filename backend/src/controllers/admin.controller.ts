import { Request, Response } from "express";
import { pool } from "../config/db";
import { ExtendedRequest } from "../interfaces/request.types";

export const getAdminStats = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Run queries in parallel
        const [
            usersRes,
            animesRes,
            episodesRes,
            newsRes,
            suggestionsRes,
            visitsRes,
            genresRes,
            activityRes
        ] = await Promise.all([
            pool.query("SELECT COUNT(*) as count FROM users"),
            pool.query("SELECT COUNT(*) as count FROM animes"),
            pool.query("SELECT COUNT(*) as count FROM episodes"),
            pool.query("SELECT COUNT(*) as count FROM anime_news"),
            pool.query("SELECT COUNT(*) as count FROM suggested_anime"),
            pool.query("SELECT COALESCE(SUM(count), 0) as count FROM user_activity"),
            pool.query("SELECT genre, COUNT(*) as count FROM animes WHERE genre IS NOT NULL GROUP BY genre"),
            pool.query(`
                SELECT TO_CHAR(visit_date, 'YYYY-MM-DD') as date, SUM(count) as count 
                FROM user_activity 
                WHERE visit_date >= CURRENT_DATE - INTERVAL '30 days' 
                GROUP BY visit_date 
                ORDER BY visit_date ASC
            `)
        ]);

        const stats = {
            totalUsers: parseInt(usersRes.rows[0].count, 10) || 0,
            totalAnimes: parseInt(animesRes.rows[0].count, 10) || 0,
            totalEpisodes: parseInt(episodesRes.rows[0].count, 10) || 0,
            totalNews: parseInt(newsRes.rows[0].count, 10) || 0,
            totalSuggestions: parseInt(suggestionsRes.rows[0].count, 10) || 0,
            totalVisits: parseInt(visitsRes.rows[0].count, 10) || 0,
            genreDistribution: genresRes.rows.map(r => ({
                genre: r.genre,
                count: parseInt(r.count, 10) || 0
            })),
            recentActivity: activityRes.rows.map(r => ({
                date: r.date,
                count: parseInt(r.count, 10) || 0
            }))
        };

        res.status(200).json({ success: true, stats });
    } catch (error: any) {
        console.error("Error in getAdminStats:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to fetch admin stats" });
    }
};

export const getUsers = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const query = `
            SELECT 
                u.id,
                u.username,
                u.email,
                COALESCE(u.is_admin, false) as role,
                u.created_at,
                COALESCE(p.avatar_url, '') as avatar_url,
                COALESCE(p.status, 'User') as status,
                COALESCE(TO_CHAR(MAX(ua.visit_date), 'YYYY-MM-DD'), TO_CHAR(u.created_at, 'YYYY-MM-DD')) as last_active,
                COALESCE(SUM(ua.count), 0)::int as total_visits,
                COUNT(DISTINCT ua.visit_date)::int as active_days,
                (SELECT COUNT(*)::int FROM favorites f WHERE f.user_id = u.id) as favorites_count,
                (SELECT COUNT(*)::int FROM watchlists w WHERE w.user_id = u.id) as watchlist_count
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            LEFT JOIN user_activity ua ON u.id = ua.user_id
            GROUP BY u.id, u.username, u.email, u.is_admin, u.created_at, p.avatar_url, p.status
            ORDER BY COALESCE(SUM(ua.count), 0) DESC, COUNT(DISTINCT ua.visit_date) DESC, u.id ASC;
        `;
        const result = await pool.query(query);
        const users = result.rows.map(r => {
            const totalVisits = Number(r.total_visits) || 0;
            const activeDays = Number(r.active_days) || 0;
            const favoritesCount = Number(r.favorites_count) || 0;
            const watchlistCount = Number(r.watchlist_count) || 0;
            const activityScore = totalVisits * 10 + activeDays * 20 + favoritesCount * 5 + watchlistCount * 3;

            return {
                id: r.id,
                username: r.username,
                email: r.email,
                role: r.role ? "admin" : "user",
                avatarUrl: r.avatar_url,
                status: r.status,
                lastActive: r.last_active,
                createdAt: r.created_at,
                totalVisits,
                activeDays,
                favoritesCount,
                watchlistCount,
                activityScore
            };
        });

        res.status(200).json({ success: true, users });
    } catch (error: any) {
        console.error("Error in getUsers:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to fetch users" });
    }
};

export const toggleAdmin = async (req: ExtendedRequest, res: Response) => {
    try {
        const targetUserId = parseInt(req.params.id, 10);
        if (isNaN(targetUserId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }
        if (targetUserId === req.user?.id) {
            return res.status(409).json({ success: false, message: 'You cannot change your own admin role.' });
        }

        const client = await pool.connect();
        let result;
        try {
            await client.query('BEGIN');
            await client.query('SELECT pg_advisory_xact_lock(7610435)');
            const admins = await client.query('SELECT id FROM users WHERE is_admin = true ORDER BY id');
            if (admins.rows.length <= 1 && admins.rows.some(row => row.id === targetUserId)) {
                await client.query('ROLLBACK');
                return res.status(409).json({ message: 'At least one administrator must remain.' });
            }
            result = await client.query('UPDATE users SET is_admin = NOT COALESCE(is_admin, false) WHERE id = $1 RETURNING id, username, is_admin', [targetUserId]);
            await client.query('COMMIT');
        } catch (error) { await client.query('ROLLBACK'); throw error; }
        finally { client.release(); }

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User role updated", user: result.rows[0] });
    } catch (error: any) {
        console.error("Error in toggleAdmin:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to update user role" });
    }
};

export const deleteUser = async (req: ExtendedRequest, res: Response) => {
    try {
        const targetUserId = parseInt(req.params.id, 10);
        if (isNaN(targetUserId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        if (targetUserId === req.user?.id) {
            return res.status(409).json({ success: false, message: 'You cannot delete your own admin account.' });
        }
        const client = await pool.connect();
        let result;
        try {
            await client.query('BEGIN');
            await client.query('SELECT pg_advisory_xact_lock(7610435)');
            const admins = await client.query('SELECT id FROM users WHERE is_admin = true ORDER BY id');
            if (admins.rows.length <= 1 && admins.rows.some(row => row.id === targetUserId)) {
                await client.query('ROLLBACK');
                return res.status(409).json({ message: 'At least one administrator must remain.' });
            }
            await client.query('SELECT id FROM users WHERE id = $1 FOR UPDATE', [targetUserId]);
            for (const table of ['reviews', 'favorites', 'watchlists']) {
                await client.query(`DELETE FROM ${table} WHERE user_id = $1`, [targetUserId]);
            }
            // Preserve payment history when an account is removed.
            await client.query('UPDATE donations SET user_id = NULL WHERE user_id = $1', [targetUserId]);
            result = await client.query('DELETE FROM users WHERE id = $1 RETURNING id, username', [targetUserId]);
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally { client.release(); }

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to delete user" });
    }
};
