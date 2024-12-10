import { useEffect } from 'react';
import { X } from 'lucide-react';

interface NotificationProps {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  onDismiss: (id: string) => void;
  timeout?: number;
}

export const Notification = ({ id, message, type, onDismiss, timeout }: NotificationProps) => {
  useEffect(() => {
    if (timeout) {
      const timer = setTimeout(() => onDismiss(id), timeout);
      return () => clearTimeout(timer);
    }
  }, [id, timeout, onDismiss]);

  const getTypeStyles = () => {
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
    <div className={`flex items-center justify-between p-4 rounded-lg shadow-lg border animate-fade-in ${getTypeStyles()}`}>
      <p className="text-sm md:text-base">{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className="p-1 hover:bg-white/50 rounded-full transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};