import { create } from 'zustand';
import { useNotificationSettingsStore } from './notificationSettingsStore';
import { v4 as uuidv4 } from 'uuid';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timeout?: number;
  isOffline?: boolean;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const settings = useNotificationSettingsStore.getState();
    
    // Check notification settings
    if (notification.isOffline && !settings.showOfflineNotifications) return;
    if (!notification.isOffline && !settings.showOnlineNotifications) return;
    if (notification.type === 'success' && !settings.showSuccessNotifications) return;
    if (notification.type === 'error' && !settings.showErrorNotifications) return;

    const id = uuidv4();
    
    set((state) => {
      // Remove duplicate notifications
      const filteredNotifications = state.notifications.filter(n => 
        !(n.type === notification.type && n.message === notification.message)
      );
      
      // Keep only the last 3 notifications
      while (filteredNotifications.length >= 3) {
        filteredNotifications.shift();
      }
      
      const newNotification = { ...notification, id };
      
      // If timeout is provided, set up automatic removal
      if (notification.timeout) {
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id)
          }));
        }, notification.timeout);
      }
      
      return {
        notifications: [...filteredNotifications, newNotification]
      };
    });
  },
  
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    })),
    
  clearNotifications: () => set({ notifications: [] })
}));