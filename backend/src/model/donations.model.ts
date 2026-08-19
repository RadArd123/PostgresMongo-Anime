import { pool } from '../config/db';
import { Donation, DonationStats } from '../interfaces/donations.types';

export const donationModel = {
  createDonation: async (
    user_id: number,
    tier_name: string,
    amount: number,
    coffees: number,
    donor_name: string | null,
    message: string | null
  ): Promise<Donation> => {
    const { rows } = await pool.query(
      `INSERT INTO donations (user_id, tier_name, amount, coffees, donor_name, message) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, tier_name, amount, coffees, donor_name, message]
    );
    return rows[0];
  },

  getDonations: async (limit: number = 20): Promise<Donation[]> => {
    const { rows } = await pool.query(
      `SELECT d.*, u.username, p.avatar_url 
       FROM donations d 
       JOIN users u ON d.user_id = u.id 
       LEFT JOIN profiles p ON u.id = p.user_id 
       ORDER BY d.created_at DESC 
       LIMIT $1`,
      [limit]
    );
    return rows;
  },

  getUserDonations: async (user_id: number): Promise<Donation[]> => {
    const { rows } = await pool.query(
      `SELECT d.*, u.username, p.avatar_url 
       FROM donations d 
       JOIN users u ON d.user_id = u.id 
       LEFT JOIN profiles p ON u.id = p.user_id 
       WHERE d.user_id = $1 
       ORDER BY d.created_at DESC`,
      [user_id]
    );
    return rows;
  },

  getDonationStats: async (): Promise<DonationStats> => {
    const { rows } = await pool.query(
      `SELECT 
         COALESCE(SUM(amount), 0) as total_raised, 
         COUNT(DISTINCT user_id) as total_supporters, 
         COALESCE(SUM(coffees), 0) as total_coffees 
       FROM donations`
    );
    return rows[0];
  }
};
