import { memo } from 'react';
import { X } from 'lucide-react';

interface NotificationItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timeout?: number;
}

interface NotificationContainerProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
}

export const NotificationContainer = memo(({ notifications, onDismiss }: NotificationContainerProps) => {
  const getTypeStyles = (type: NotificationItem['type']) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
  };

  return (
    <div className="fixed top-20 left-4 right-4 md:left-72 md:right-4 z-[1000] flex flex-col gap-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center justify-between p-4 rounded-lg shadow-lg border animate-fade-in ${getTypeStyles(notification.type)}`}
        >
          <p className="text-sm md:text-base">{notification.message}</p>
          <button
            onClick={() => onDismiss(notification.id)}
            className="p-1 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
});

NotificationContainer.displayName = 'NotificationContainer';