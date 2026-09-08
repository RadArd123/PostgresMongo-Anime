import { pool } from '../config/db';
import { Donation, DonationStats } from '../interfaces/donations.types';

export const donationModel = {
  createStripeDonation: async (
    user_id: number | null,
    tier_name: string,
    amount: number,
    coffees: number,
    donor_name: string | null,
    message: string | null,
    stripe_session_id: string,
    stripe_event_id: string
  ): Promise<Donation | null> => {
    const { rows } = await pool.query(
      `INSERT INTO donations (
         user_id, tier_name, amount, coffees, donor_name, message,
         stripe_session_id, stripe_event_id
       )
       VALUES ((SELECT id FROM users WHERE id = $1), $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (stripe_session_id) DO NOTHING
       RETURNING *`,
      [
        user_id,
        tier_name,
        amount,
        coffees,
        donor_name,
        message,
        stripe_session_id,
        stripe_event_id,
      ]
    );
    return rows[0] || null;
  },

  getDonations: async (limit: number = 20): Promise<Donation[]> => {
    const { rows } = await pool.query(
      `SELECT d.*, u.username, p.avatar_url
       FROM donations d
       LEFT JOIN users u ON d.user_id = u.id
       LEFT JOIN profiles p ON u.id = p.user_id
       ORDER BY d.amount DESC, d.created_at DESC
       LIMIT $1`,
      [limit]
    );
    return rows;
  },

  getUserDonations: async (user_id: number): Promise<Donation[]> => {
    const { rows } = await pool.query(
      `SELECT d.*, u.username, p.avatar_url
       FROM donations d
       LEFT JOIN users u ON d.user_id = u.id
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
         COUNT(id) as total_supporters,
         COALESCE(SUM(coffees), 0) as total_coffees
       FROM donations`
    );
    return rows[0];
  }
};
