import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export interface LatestEpisode {
  id: number;
  anime_id: number;
  title: string;
  duration?: number;
  episode_number: number;
  video_url: string;
  created_at: string;
  anime_title: string;
  img_url_icon: string;
}

interface LatestEpisodesStore {
  episodes: LatestEpisode[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  fetchLatestEpisodes: (page: number, limit?: number) => Promise<void>;
  resetStore: () => void;
}

export const useLatestEpisodesStore = create<LatestEpisodesStore>((set) => ({
  episodes: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,

  fetchLatestEpisodes: async (page: number, limit: number = 6) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/episodes/latest?page=${page}&limit=${limit}`);
      const newEpisodes = response.data.episodes;
      
      set((state) => ({
        episodes: page === 1 ? newEpisodes : [...state.episodes, ...newEpisodes],
        page: page,
        hasMore: newEpisodes.length === limit,
        loading: false,
      }));
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || "Error fetching latest episodes",
        loading: false 
      });
    }
  },

  resetStore: () => set({ episodes: [], page: 1, hasMore: true, error: null })
}));
