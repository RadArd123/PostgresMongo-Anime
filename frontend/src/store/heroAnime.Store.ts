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
            set({ error: error.response?.data?.message || error.message, isLoading: false });
        }finally {
            set({ isLoading: false });
        }
  },
  getHeroAnimes: async (): Promise<void> => {
        set({ isLoading: true, error: null });
        try{
            const response = await axiosInstance.get("/anime-data/getHeroAnimes");
            const data = response.data.heroAnimes || (Array.isArray(response.data) ? response.data : []);
            set({ heroAnimes: data });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
        }finally {
            set({ isLoading: false });
        }
  },
  removeHeroAnime: async (id: number): Promise<void> => {
        set({ isLoading: true, error: null });
        try{
            const response = await axiosInstance.delete(`/anime-data/removeHeroAnime/${id}`);
            set((state) => ({
                heroAnimes: state.heroAnimes.filter((heroAnime:any) => String(heroAnime.id) !== String(id)),
                message: response.data.message
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
        }finally {
            set({ isLoading: false });
        }
  },
  updateHeroAnime: async (id: number, data: Partial<IHeroAnime>): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.put(`/anime-data/updateHeroAnime/${id}`, data);
            set((state) => ({
                heroAnimes: state.heroAnimes.map((ha) => String(ha.id) === String(id) ? response.data.heroAnime : ha),
                message: response.data.message
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
        } finally {
            set({ isLoading: false });
        }
  }
}));