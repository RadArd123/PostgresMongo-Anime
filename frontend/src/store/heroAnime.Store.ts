import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import type {IHeroAnime, IHeroAnimeResponse} from '../interfaces/heroAnime.types';

export const useHeroAnimeStore = create<IHeroAnimeResponse>((set) => ({
  heroAnimes: [],
  isLoading: false,
  error: null,
  message: null,   
  addHeroAnime: async (heroAnimeData: Partial<IHeroAnime>): Promise<void> => {
        set({ isLoading: true, error: null });
        try{
            const response = await axiosInstance.post("/anime-data/addHeroAnime", heroAnimeData);
            set((state) => ({heroAnimes: [...state.heroAnimes, response.data.heroAnime], message: response.data.message}));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }finally {
            set({ isLoading: false });
        }
  },
  getHeroAnimes: async (): Promise<void> => {
        set({ isLoading: true, error: null });
        try{
            const response = await axiosInstance.get("anime-data/getHeroAnimes");
            set({ heroAnimes: response.data.heroAnimes });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }finally {
            set({ isLoading: false });
        }
  },
  removeHeroAnime: async (id: string): Promise<void> => {
        set({ isLoading: true, error: null });
        try{
            const response = await axiosInstance.delete(`anime-data/removeHeroAnime/${id}`);
            set((state) => ({
                heroAnimes: state.heroAnimes.filter((heroAnime:any) => heroAnime._id !== id),
                message: response.data.message
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }finally {
            set({ isLoading: false });
        }
  },
}));