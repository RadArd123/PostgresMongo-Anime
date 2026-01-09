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
            set({ error: error.message, isLoading: false });
        }finally {
            set({ isLoading: false });
        }
    },
    getSuggestedAnimes: async (): Promise<void> => {
        set({ isLoading: true, error: null });
        try{
            const response = await axiosInstance.get("anime-data/getSuggestedAnimes");
            set({ suggestedAnimes: response.data.suggestedAnimes });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }finally {
            set({ isLoading: false });
        }
    },
    removeSuggestedAnime: async (id: string): Promise<void> => {
        set({ isLoading: true, error: null });
        try{
            const response = await axiosInstance.delete(`anime-data/removeSuggestedAnime/${id}`);
            set((state) => ({
                suggestedAnimes: state.suggestedAnimes.filter((suggestedAnime:any) => suggestedAnime._id !== id),
                message: response.data.message
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }finally {
            set({ isLoading: false });
        }
    },
}));