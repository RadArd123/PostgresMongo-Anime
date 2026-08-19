export interface ContinueWatchingItem {
  id: number;
  user_id: number;
  anime_id: number;
  episode_id: number;
  progress_seconds: number;
  duration_seconds: number;
  completed: boolean;
  last_watched: string;
  // Joined fields from animes and episodes
  anime_title?: string;
  img_url_icon?: string;
  img_url_banner?: string;
  episode_number?: number;
  episode_title?: string;
  video_url?: string;
}
