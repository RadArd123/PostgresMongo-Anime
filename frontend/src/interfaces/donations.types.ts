export interface Donation {
  id: number;
  user_id: number;
  tier_name: string;
  amount: number;
  coffees: number;
  donor_name: string | null;
  message: string | null;
  created_at: string;
  username?: string;
  avatar_url?: string;
}

export interface DonationStats {
  total_raised: number;
  total_supporters: number;
  total_coffees: number;
}

export interface DonationInput {
  tier_name: string;
  amount: number;
  coffees: number;
  donor_name: string;
  message: string;
}

export interface DonationStore {
  donations: Donation[];
  stats: DonationStats | null;
  userDonations: Donation[];
  isLoading: boolean;
  error: string | null;
  fetchDonations: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchUserDonations: () => Promise<void>;
  createDonation: (data: DonationInput) => Promise<boolean>;
}
