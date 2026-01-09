export interface Anime {
    id: number;
    title: string;
    description?: string;
    genre?: string;
    release_year?: number;
    img_url_icon: string;
    img_url_banner: string;
    created_at?: Date;
}
export interface FavoriteAnime extends Anime {
  added_at: Date; 
}
export interface WatchlistAnime extends Anime {
  added_at: Date; 
}