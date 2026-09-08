import { adminMutationFailed } from "@/lib/adminMutation";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { IAnimeNews, IAnimeNewsResponse } from "../interfaces/animeNews.types";

export const useAnimeNewsStore = create<IAnimeNewsResponse>((set) => ({
  animeNews: [],
  isLoading: false,
  error: null,
  message: null,

    addAnimeNews: async (animeNewsData: Partial<IAnimeNews>): Promise<void> => {
        set({ isLoading: true, error: null });
        try{
            const response = await axiosInstance.post("/anime-data/addAnimeNews", animeNewsData);
            set((state) => ({
                animeNews: [...state.animeNews, response.data.animeNews],message: response.data.message
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
          adminMutationFailed(error, "Unable to save this change.");
    }finally {
            set({ isLoading: false });
        }
    },
    getAnimeNews: async (): Promise<void> => {
        set({ isLoading: true, error: null });
        try{
            const response = await axiosInstance.get("/anime-data/getAnimeNews");
            const newsData = response.data.animeNews || (Array.isArray(response.data) ? response.data : []);
            set({ animeNews: newsData });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
        }finally {
            set({ isLoading: false });
        }
    },
    removeAnimeNews: async (id: number): Promise<void> => {
        set({ isLoading: true, error: null });
        try{
            const response = await axiosInstance.delete(`/anime-data/removeAnimeNews/${id}`);
            set((state) => ({
                animeNews: state.animeNews.filter((news: any) => String(news.id) !== String(id)),
                message: response.data.message
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
          adminMutationFailed(error, "Unable to save this change.");
    }finally {
            set({ isLoading: false });
        }
    },
    updateAnimeNews: async (id: number, data: Partial<IAnimeNews>): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.put(`/anime-data/updateAnimeNews/${id}`, data instanceof FormData ? data : { ...data, overlay_stats: undefined, rating: data.overlay_stats?.rating ?? null, views_text: data.overlay_stats?.views_text ?? null, related_postgres_anime_id: data.related_postgres_anime_id ?? null });
            set((state) => ({
                animeNews: state.animeNews.map((news: any) => String(news.id) === String(id) ? response.data.animeNews : news),
                message: response.data.message
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
          adminMutationFailed(error, "Unable to save this change.");
    } finally {
            set({ isLoading: false });
        }
    }
}));
