import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import type { DonationStore, DonationInput } from '../interfaces/donations.types';

export const useDonationStore = create<DonationStore>((set, get) => ({
  donations: [],
  stats: null,
  userDonations: [],
  isLoading: false,
  error: null,

  fetchDonations: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/donations');
      set({ donations: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch donations' 
      });
    }
  },

  fetchStats: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/donations/stats');
      set({ stats: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch donation stats' 
      });
    }
  },

  fetchUserDonations: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/donations/my');
      set({ userDonations: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch user donations' 
      });
    }
  },

  createDonation: async (data: DonationInput) => {
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.post('/donations', data);
      
      // Refetch stats and donations after successful creation
      await get().fetchDonations();
      await get().fetchStats();
      
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to create donation' 
      });
      return false;
    }
  }
}));
