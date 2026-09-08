import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export type NotificationType =
  | 'new_episode'
  | 'admin_message'
  | 'donation_thanks'
  | 'badge_awarded'
  | 'chat_mention'
  | 'system';

export interface AppNotification {
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
  sender_username?: string;
  sender_avatar?: string;
  anime_title?: string;
  badge_name?: string;
  badge_color?: string;
  badge_icon_url?: string;
}

export interface NotificationPreferences {
  notify_new_episode: boolean;
  notify_admin_msg: boolean;
  notify_badge: boolean;
  notify_mention: boolean;
  notify_system: boolean;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  preferences: NotificationPreferences | null;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  fetchPreferences: () => Promise<void>;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  addNotification: (notif: AppNotification) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  preferences: null,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/notifications');
      set({
        notifications: res.data.notifications || [],
        unreadCount: res.data.unreadCount || 0,
      });
    } catch (err) {
      console.error('fetchNotifications error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await axiosInstance.get('/notifications/unread-count');
      set({ unreadCount: res.data.count });
    } catch (err) {
      console.error('fetchUnreadCount error:', err);
    }
  },

  markAsRead: async (id: string) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (err) {
      console.error('markAsRead error:', err);
    }
  },

  markAllAsRead: async () => {
    try {
      await axiosInstance.patch('/notifications/read-all');
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.error('markAllAsRead error:', err);
    }
  },

  deleteNotification: async (id: string) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: state.notifications.find((n) => n.id === id && !n.is_read)
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      }));
    } catch (err) {
      console.error('deleteNotification error:', err);
    }
  },

  deleteAllNotifications: async () => {
    try {
      await axiosInstance.delete('/notifications');
      set({ notifications: [], unreadCount: 0 });
    } catch (err) {
      console.error('deleteAllNotifications error:', err);
    }
  },

  fetchPreferences: async () => {
    try {
      const res = await axiosInstance.get('/notifications/preferences');
      set({ preferences: res.data.preferences });
    } catch (err) {
      console.error('fetchPreferences error:', err);
    }
  },

  updatePreferences: async (prefs) => {
    try {
      const res = await axiosInstance.put('/notifications/preferences', prefs);
      set({ preferences: res.data.preferences });
    } catch (err) {
      console.error('updatePreferences error:', err);
    }
  },

  addNotification: (notif: AppNotification) => {
    set((state) => {
      if (state.notifications.some((n) => n.id === notif.id)) return state;
      return {
        notifications: [notif, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    });
  },
}));
