
export interface Episode{
    id: number;
    anime_id: number;
    title: string;
    duration?: number;
    episode_number: number;
    video_url: string;
    created_at?: Date;
}

export interface LatestEpisode extends Episode {
    anime_title: string;
    img_url_icon: string;
}