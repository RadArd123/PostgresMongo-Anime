export interface Episode{
    id: number;
    anime_id: number;
    title: string;
    duration?: number;
    episode_number: number;
    video_url: string;
    created_at?: Date;
}

export interface EpisodeResponse{
    episodes: Episode[];
    episodesById: Episode[];
    currentEpisode: Episode | null;
    error?: string | null;
    isLoading: boolean;
    message?: string | null;
    createEpisode?: (episodeData: Partial<Episode>) => Promise<void>;
    fetchEpisodesByAnimeId?: (animeId: number) => Promise<void>;
    deleteEpisode?: (id: number) => Promise<void>;
    getEpisodeById?: (id: number) => Promise<void>;
    resetEpisodes: () => void;  
    
}