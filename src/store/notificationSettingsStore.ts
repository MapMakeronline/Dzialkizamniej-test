import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationSettings {
  showOfflineNotifications: boolean;
  showOnlineNotifications: boolean;
  showSuccessNotifications: boolean;
  showErrorNotifications: boolean;
}

interface NotificationSettingsState extends NotificationSettings {
  updateSettings: (settings: Partial<NotificationSettings>) => void;
}

export const useNotificationSettingsStore = create<NotificationSettingsState>()(
  persist(
    (set) => ({
      showOfflineNotifications: true,
      showOnlineNotifications: true,
      showSuccessNotifications: true,
      showErrorNotifications: true,
      
      updateSettings: (newSettings) => 
        set((state) => ({ ...state, ...newSettings }))
    }),
    {
      name: 'notification-settings'
    }
  )
);