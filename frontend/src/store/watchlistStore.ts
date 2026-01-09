import {create} from 'zustand';
import  {axiosInstance} from '../lib/axios';
import type { WatchlistResponse } from '../interfaces/watchlist.types.ts';



export const useWatchlistStore = create<WatchlistResponse>((set) => ({
    watchlist: [],
    error: null,
    isLoading: false,
    message: null,

    addToWatchlist: async (animeId: number): Promise<void> => {
        set({isLoading: true, error: null});
        try{
            const response = await axiosInstance.post('/watchlist/addWatchlist', {animeId});
            set((state) => ({watchlist: [...state.watchlist, response.data.watchlistAnime], message: response.data.message}));
        }catch (err: any) {
            set({error: err.response?.data?.message || 'Failed to add to watchlist'});
        } finally {
            set({isLoading: false});
        }
    },
    fetchWatchlist: async (): Promise<void> => {
        set({isLoading: true, error: null});
        try {
            const response = await axiosInstance.get(`/watchlist/getWatchlist`);
            set({watchlist: response.data.watchlist, message: response.data.message});
        } catch (err: any) {
            set({error: err.response?.data?.message || 'Failed to fetch watchlist'});
        } finally {
            set({isLoading: false});
        }
    },
    removeFromWatchlist: async (animeId: number): Promise<void> => {
        set({isLoading: true, error: null});
        try {
            const response = await axiosInstance.delete(`/watchlist/removeFromWatchlist/${animeId}`);
            set((state) => ({watchlist: state.watchlist.filter(anime => anime.id !== animeId), message: response.data.message}));
        } catch (err: any) {
            set({error: err.response?.data?.message || 'Failed to remove from watchlist'});
        } finally {
            set({isLoading: false});
        }
    }
}));


