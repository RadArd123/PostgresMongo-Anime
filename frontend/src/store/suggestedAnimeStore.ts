import { adminMutationFailed } from "@/lib/adminMutation";
import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import type {ISuggestedAnime, ISuggestedAnimeResponse} from '../interfaces/suggestedAnime.types';

export const useSuggestedAnimeStore = create<ISuggestedAnimeResponse>((set) => ({
    suggestedAnimes: [],
    isLoading: false,
    error: null,
    message: null,
    addSuggestedAnime: async (suggestedAnimeData: Partial<ISuggestedAnime>): Promise<void> => {
        set({ isLoading: true, error: null });
        try{
            const response = await axiosInstance.post("/anime-data/addSuggestedAnime", suggestedAnimeData);
            set((state) => ({
                suggestedAnimes: [...state.suggestedAnimes, response.data.suggestedAnime],
                message: response.data.message
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
          adminMutationFailed(error, "Unable to save this change.");
    }finally {
            set({ isLoading: false });
        }
    },
    getSuggestedAnimes: async (): Promise<void> => {
        set({ isLoading: true, error: null });
        try{
            const response = await axiosInstance.get("/anime-data/getSuggestedAnimes");
            const data = response.data.suggestedAnimes || (Array.isArray(response.data) ? response.data : []);
            set({ suggestedAnimes: data });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
        }finally {
            set({ isLoading: false });
        }
    },
    removeSuggestedAnime: async (id: number): Promise<void> => {
        set({ isLoading: true, error: null });
        try{
            const response = await axiosInstance.delete(`/anime-data/removeSuggestedAnime/${id}`);
            set((state) => ({
                suggestedAnimes: state.suggestedAnimes.filter((suggestedAnime:any) => String(suggestedAnime.id) !== String(id)),
                message: response.data.message
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
          adminMutationFailed(error, "Unable to save this change.");
    }finally {
            set({ isLoading: false });
        }
    },
    updateSuggestedAnime: async (id: number, data: Partial<ISuggestedAnime>): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.put(`/anime-data/updateSuggestedAnime/${id}`, data);
            set((state) => ({
                suggestedAnimes: state.suggestedAnimes.map((sa) => String(sa.id) === String(id) ? response.data.suggestedAnime : sa),
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
