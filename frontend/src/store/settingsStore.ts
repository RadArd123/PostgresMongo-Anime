import { create } from 'zustand';

export interface NotificationSettings {
  newEpisodes: boolean;
  communityMentions: boolean;
  emailDigest: boolean;
  soundEffects: boolean;
}

export interface SettingsState {
  // Player & Streaming
  autoPlayNext: boolean;
  autoSkipIntro: boolean;
  autoSkipOutro: boolean;
  defaultQuality: '1080p' | '720p' | '480p' | 'auto';
  audioPreference: 'sub' | 'dub';

  // Appearance & UI
  layoutMode: 'grid' | 'list';
  blurIntensity: 'low' | 'medium' | 'high';

  // Privacy & Content
  publicWatchlist: boolean;
  nsfwFilter: boolean;
  spoilerProtection: boolean;

  // Notifications
  notifications: NotificationSettings;

  // Actions
  updateSetting: <K extends keyof Omit<SettingsState, 'notifications' | 'updateSetting' | 'updateNotification' | 'resetSettings'>>(
    key: K,
    value: SettingsState[K]
  ) => void;
  updateNotification: (key: keyof NotificationSettings, value: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  autoPlayNext: true,
  autoSkipIntro: false,
  autoSkipOutro: false,
  defaultQuality: '1080p' as const,
  audioPreference: 'sub' as const,
  layoutMode: 'grid' as const,
  blurIntensity: 'high' as const,
  publicWatchlist: true,
  nsfwFilter: true,
  spoilerProtection: true,
  notifications: {
    newEpisodes: true,
    communityMentions: true,
    emailDigest: false,
    soundEffects: true,
  },
};

const getInitialSettings = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('app-user-settings');
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
    }
  }
  return defaultSettings;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  ...getInitialSettings(),

  updateSetting: (key, value) => {
    set((state) => {
      const nextState = { ...state, [key]: value };
      if (typeof window !== 'undefined') {
        try {
          const toSave = {
            autoPlayNext: nextState.autoPlayNext,
            autoSkipIntro: nextState.autoSkipIntro,
            autoSkipOutro: nextState.autoSkipOutro,
            defaultQuality: nextState.defaultQuality,
            audioPreference: nextState.audioPreference,
            layoutMode: nextState.layoutMode,
            blurIntensity: nextState.blurIntensity,
            publicWatchlist: nextState.publicWatchlist,
            nsfwFilter: nextState.nsfwFilter,
            spoilerProtection: nextState.spoilerProtection,
            notifications: nextState.notifications,
          };
          localStorage.setItem('app-user-settings', JSON.stringify(toSave));
        } catch (e) {
          console.error('Failed to save settings', e);
        }
      }
      return { [key]: value };
    });
  },

  updateNotification: (key, value) => {
    set((state) => {
      const nextNotifs = { ...state.notifications, [key]: value };
      if (typeof window !== 'undefined') {
        try {
          const currentSaved = JSON.parse(localStorage.getItem('app-user-settings') || '{}');
          localStorage.setItem(
            'app-user-settings',
            JSON.stringify({ ...currentSaved, notifications: nextNotifs })
          );
        } catch (e) {
          console.error('Failed to save notifications setting', e);
        }
      }
      return { notifications: nextNotifs };
    });
  },

  resetSettings: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('app-user-settings');
    }
    set(defaultSettings);
  },
}));
