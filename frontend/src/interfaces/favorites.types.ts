import {  type FavoriteAnime   } from "./anime.types";

export interface Favorites {
    id: number;
    user_id: number;
    anime_id: number;
    added_at?: Date;
}

export interface FavoritesResponse {
    currentUserFavorites: FavoriteAnime[];
    error: string | null;
    isLoading: boolean;
    message: string | null;
    addFavorite: (id: number) => Promise<void>;
    fetchFavorites: () => Promise<void>;
    removeFavorite: (id: number) => Promise<void>;
}