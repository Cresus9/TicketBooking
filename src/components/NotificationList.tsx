import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Check, CheckCheck, Info, AlertTriangle, AlertCircle } from 'lucide-react';

export default function NotificationList() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No notifications
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      <div className="p-4 bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Notifications</h3>
        <button
          onClick={() => markAllAsRead()}
          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 transition-colors ${
              notification.read ? 'opacity-75' : ''
            }`}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-500">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="flex-shrink-0 p-1 text-indigo-600 hover:bg-indigo-50 rounded-full"
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}