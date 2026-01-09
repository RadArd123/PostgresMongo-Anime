
export interface Episode{
    id: number;
    anime_id: number;
    title: string;
    duration?: number;
    episode_number: number;
    video_url: string;
    created_at?: Date;
}