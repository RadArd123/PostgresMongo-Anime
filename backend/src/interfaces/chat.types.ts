export interface ChatMessage {
  id: number;
  user_id: number;
  message: string;
  anime_id?: number | null;
  created_at: string;
  username?: string;
  avatar_url?: string;
  role?: string;
  anime_title?: string;
  img_url_icon?: string;
  img_url_banner?: string;
  rating?: number;
}
