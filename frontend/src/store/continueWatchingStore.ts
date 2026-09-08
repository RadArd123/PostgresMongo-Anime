import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export interface ContinueWatchingItem {
  id: number;
  user_id: number;
  anime_id: number;
  episode_id: number;
  progress_seconds: number;
  duration_seconds: number;
  completed: boolean;
  last_watched: string;
  anime_title?: string;
  img_url_icon?: string;
  img_url_banner?: string;
  episode_number?: number;
  episode_title?: string;
  video_url?: string;
}

interface ContinueWatchingState {
  progressByEpisode: Record<number, ContinueWatchingItem>;
  fetchEpisodeProgress: (episodeId: number) => Promise<ContinueWatchingItem | null>;
  items: ContinueWatchingItem[];
  isLoading: boolean;
  error: string | null;
  fetchContinueWatching: () => Promise<void>;
  updateProgress: (animeId: number, episodeId: number, progressSeconds?: number, durationSeconds?: number, completed?: boolean) => Promise<void>;
  removeItem: (episodeId: number) => Promise<void>;
  markCompleted: (episodeId: number) => Promise<void>;
}

export const useContinueWatchingStore = create<ContinueWatchingState>((set, get) => ({
  progressByEpisode: {},
  fetchEpisodeProgress: async episodeId => {
    const { data } = await axiosInstance.get(`/continue-watching/episode/${episodeId}`);
    if (data.item) set(state => ({ progressByEpisode: { ...state.progressByEpisode, [episodeId]: data.item } }));
    return data.item;
  },
  items: [],
  isLoading: false,
  error: null,

  fetchContinueWatching: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/continue-watching/list');
      set({ items: response.data.items || [] });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch continue watching' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProgress: async (animeId, episodeId, progressSeconds = 0, durationSeconds = 1440, completed = false) => {
    try {
      const response = await axiosInstance.post('/continue-watching/progress', {
        animeId,
        episodeId,
        progressSeconds,
        durationSeconds,
        completed
      });
      const updatedItem = response.data.item;
      if (!updatedItem) return;
      set(state => ({ progressByEpisode: { ...state.progressByEpisode, [episodeId]: updatedItem } }));

      // Update state optimistically or refetch
      if (completed) {
        set((state) => ({
          items: state.items.filter((item) => item.episode_id !== episodeId)
        }));
      } else {
        // Refetch to get full joined anime/episode titles and images
        get().fetchContinueWatching();
      }
    } catch (err: any) {
      console.error('Failed to update progress', err);
      set({ error: err.response?.data?.message || err.message });
    }
  },

  removeItem: async (episodeId) => {
    try {
      await axiosInstance.delete(`/continue-watching/remove/${episodeId}`);
      set((state) => ({
        items: state.items.filter((item) => item.episode_id !== episodeId)
      }));
    } catch (err: any) {
      console.error('Failed to remove item', err);
      set({ error: err.response?.data?.message || err.message });
    }
  },

  markCompleted: async (episodeId) => {
    try {
      const { data } = await axiosInstance.put(`/continue-watching/complete/${episodeId}`);
      if (data.item) set(state => ({ progressByEpisode: { ...state.progressByEpisode, [episodeId]: data.item } }));
      set((state) => ({
        items: state.items.filter((item) => item.episode_id !== episodeId)
      }));
    } catch (err: any) {
      console.error('Failed to mark completed', err);
      set({ error: err.response?.data?.message || err.message });
    }
  }
}));
