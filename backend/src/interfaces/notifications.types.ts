export type NotificationType =
  | 'new_episode'
  | 'admin_message'
  | 'donation_thanks'
  | 'badge_awarded'
  | 'chat_mention'
  | 'system';

export interface Notification {
  id: string;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  action_url?: string | null;
  image_url?: string | null;
  anime_id?: number | null;
  sender_id?: number | null;
  badge_id?: number | null;
  is_read: boolean;
  is_deleted: boolean;
  created_at: string;
  read_at?: string | null;
  // joined fields
  sender_username?: string;
  sender_avatar?: string;
  anime_title?: string;
  badge_name?: string;
  badge_color?: string;
  badge_icon_url?: string;
}

export interface NotificationPreferences {
  user_id: number;
  notify_new_episode: boolean;
  notify_admin_msg: boolean;
  notify_badge: boolean;
  notify_mention: boolean;
  notify_system: boolean;
}
