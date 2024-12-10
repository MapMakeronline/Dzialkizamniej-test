import { Bell, BellOff } from 'lucide-react';
import { useNotificationSettingsStore } from '../../store/notificationSettingsStore';

export const NotificationSettings = () => {
  const {
    showOfflineNotifications,
    showOnlineNotifications,
    showSuccessNotifications,
    showErrorNotifications,
    updateSettings
  } = useNotificationSettingsStore();

  return (
    <div className="fixed bottom-4 right-4 z-[1000]">
      <div className="relative group">
        <button
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          title="Notification Settings"
        >
          {showOfflineNotifications && showOnlineNotifications ? (
            <Bell className="h-5 w-5 text-gray-600" />
          ) : (
            <BellOff className="h-5 w-5 text-gray-400" />
          )}
        </button>

        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-white rounded-lg shadow-lg p-4 min-w-[200px]">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Notification Settings</h3>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOnlineNotifications}
                  onChange={(e) => updateSettings({ showOnlineNotifications: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-sm text-gray-600">Online Notifications</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOfflineNotifications}
                  onChange={(e) => updateSettings({ showOfflineNotifications: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-sm text-gray-600">Offline Notifications</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showSuccessNotifications}
                  onChange={(e) => updateSettings({ showSuccessNotifications: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-sm text-gray-600">Success Messages</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showErrorNotifications}
                  onChange={(e) => updateSettings({ showErrorNotifications: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-sm text-gray-600">Error Messages</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};