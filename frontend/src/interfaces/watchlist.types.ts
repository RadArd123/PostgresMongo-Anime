
import type {WatchlistAnime } from "./anime.types";

export interface Watchlists{
    id: number,
    user_id: number,
    anime_id: number,
    added_at?: Date
}

export interface WatchlistResponse {
    watchlist: WatchlistAnime[];
    error?: any;
    isLoading: boolean;
    message?: string | null;
    addToWatchlist: (animeId: number) => Promise<void>;
    fetchWatchlist: () => Promise<void>;
    removeFromWatchlist: (animeId: number) => Promise<void>;
}