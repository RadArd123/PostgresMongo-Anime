import {create} from 'zustand';
import  {axiosInstance} from '../lib/axios';
import type { FavoritesResponse } from '../interfaces/favorites.types.ts';


export const useFavoritesStore = create<FavoritesResponse>((set) => ({
    currentUserFavorites: [],
    error: null,
    isLoading: false,
    message: null,
    addFavorite: async (id: number): Promise<void> => {
        set({isLoading: true, error: null});
        try{
            const response = await axiosInstance.post('/favorites/addFavorites', { anime_id: id });
            set((state) => ({currentUserFavorites: [...state.currentUserFavorites, response.data.favorite], message: response.data.message}));
        }catch (err: any) {
            set({error: err.response?.data?.message || 'Adding to favorites failed'});
        } finally {
            set({isLoading: false});    
        }
    },
    fetchFavorites: async () => {
        set({isLoading: true, error: null});
        try{
            const response = await axiosInstance.get(`/favorites/getFavorites`);
            set({currentUserFavorites: response.data.favorites});
        }catch (err: any) {
            set({error: err.response?.data?.message || 'Failed to fetch favorites'});
        } finally {
            set({isLoading: false});
        }
    },
    removeFavorite : async (id: number) => {
        set({isLoading: true, error: null});
        try{
            const response = await axiosInstance.delete(`/favorites/deleteFavorites/${id}`);
            set((state) => ({currentUserFavorites: state.currentUserFavorites.filter((favorite) => favorite.id !== id),message: response.data.message}));
        }catch (err: any) {
            set({error: err.response?.data?.message || 'Failed to remove favorite'}); 
        } finally {
            set({isLoading: false});
        }
    },
}));