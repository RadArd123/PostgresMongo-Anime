import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export interface Profile {
  profile_id: number;
  status: string;
  avatar_url: string;
  banner_url: string;
  bio: string;
  profile_created_at: string;
  user_id: number;
  username: string;
  email: string;
}

interface ProfileStore {
  profile: Profile | null;
  activity: { date: string; count: number }[];
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  fetchActivity: () => Promise<void>;
  updateProfile: (data: { status?: string; avatar_url?: string; banner_url?: string; bio?: string }) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  activity: [],
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/profiles/me");
      set({ profile: response.data.profile, loading: false });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || "Error fetching profile", 
        loading: false 
      });
    }
  },

  fetchActivity: async () => {
    try {
      const response = await axiosInstance.get("/profiles/activity");
      set({ activity: response.data.activity || [] });
    } catch (err) {
      console.error("Error fetching activity:", err);
    }
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put("/profiles/me", data);
      set({ profile: response.data.profile, loading: false });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || "Error updating profile", 
        loading: false 
      });
      throw err;
    }
  },

  deleteAccount: async () => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete("/auth/delete-account");
      set({ profile: null, loading: false });
      window.location.href = "/";
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || "Error deleting account", 
        loading: false 
      });
      throw err;
    }
  }
}));
