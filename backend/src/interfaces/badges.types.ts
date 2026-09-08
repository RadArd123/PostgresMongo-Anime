export interface Badge {
  id: number;
  name: string;
  description?: string;
  icon_url?: string;
  color: string;
  created_at: string;
}

export interface UserBadge {
  id: number;
  user_id: number;
  badge_id: number;
  awarded_by?: number;
  awarded_at: string;
  // joined fields
  badge_name?: string;
  badge_description?: string;
  badge_icon_url?: string;
  badge_color?: string;
  awarded_by_username?: string;
}
