export interface Donation {
  id: number;
  user_id: number;
  tier_name: string;
  amount: number;
  coffees: number;
  donor_name: string | null;
  message: string | null;
  created_at: string;
  // Joined fields from profiles/users
  username?: string;
  avatar_url?: string;
}

export interface DonationStats {
  total_raised: number;
  total_supporters: number;
  total_coffees: number;
}
