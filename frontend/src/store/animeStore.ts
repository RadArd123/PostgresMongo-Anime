import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { AnimeResponse, Anime } from "../interfaces/anime.types";

export const useAnimeStore = create<AnimeResponse>((set) => ({
  animes: [],
  anime: null,
  error: null,
  isLoading: false,
  message: null,

  createAnime: async (animeData: Partial<Anime>): Promise<void> => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(
        "/animes/create-anime",
        animeData
      );
      set((state) => ({
        animes: [...state.animes, response.data.anime],
        message: response.data.message,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Anime creation failed" });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAnimes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/animes/get-animes");
      set({
        animes: response.data.animes,
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch animes" });
    } finally {
      set({ isLoading: false });
    }
  },
  getAnimeById: async (id: number) => {
    set({ isLoading: true, error: null });
    try{
        const response = await axiosInstance.get(`/animes/${id}`);
        set({ anime: response.data.anime });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch anime" });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAnime: async (id: number) => {
    set({ isLoading: true, error: null });
    try{
        const response = await axiosInstance.delete(`/animes/delete-anime/${id}`);
        set((state) => ({animes: state.animes.filter((anime) => anime.id !== id),message: response.data.message}));
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Anime deletion failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateAnime: async (id: number, animeData: Partial<Anime>) => {
    set({ isLoading: true, error: null });
    try{
        const response = await axiosInstance.put(`/animes/update-anime/${id}`, animeData);
        set((state) => ({animes: state.animes.map((anime) => anime.id === id ? response.data.anime : anime),message: response.data.message,}));
    }catch (err: any) {
        set({ error: err.response?.data?.message || "Anime update failed" });
    } finally {
        set({ isLoading: false });
    }
  },
}));
