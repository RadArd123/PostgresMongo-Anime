export interface ISuggestedAnime {
    id: number;
    postgres_anime_id: number;
    title: string;
    description?: string;      
    views_count?: string;      
    rating?: number;           
    
    badge_label: string;     
    poster_image: string;
    
    created_at: Date;          
}

export interface ISuggestedAnimeResponse {
    suggestedAnimes: ISuggestedAnime[];
    isLoading: boolean;
    error: string | null;
    message?: string | null;
    addSuggestedAnime: (suggestedAnimeData: Partial<ISuggestedAnime>) => Promise<void>;
    getSuggestedAnimes: () => Promise<void>;
    removeSuggestedAnime: (id: number) => Promise<void>;
    updateSuggestedAnime: (id: number, data: Partial<ISuggestedAnime>) => Promise<void>;
}