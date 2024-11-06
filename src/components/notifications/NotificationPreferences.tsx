import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Mail, AlertCircle } from 'lucide-react';

const notificationTypes = [
  { id: 'EVENT_REMINDER', label: 'Event Reminders' },
  { id: 'TICKET_PURCHASED', label: 'Ticket Purchases' },
  { id: 'PRICE_CHANGE', label: 'Price Changes' },
  { id: 'EVENT_CANCELLED', label: 'Event Cancellations' },
  { id: 'EVENT_UPDATED', label: 'Event Updates' }
];

export default function NotificationPreferences() {
  const { updatePreferences, requestPushPermission } = useNotifications();
  const [preferences, setPreferences] = useState({
    email: true,
    push: false,
    types: notificationTypes.map(t => t.id)
  });
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check push notification permission status
    if ('Notification' in window) {
      setPushPermission(Notification.permission);
    }
  }, []);

  const handlePushToggle = async () => {
    if (!preferences.push) {
      await requestPushPermission();
      setPushPermission(Notification.permission);
      if (Notification.permission === 'granted') {
        setPreferences(prev => ({ ...prev, push: true }));
        await updatePreferences({ ...preferences, push: true });
      }
    } else {
      setPreferences(prev => ({ ...prev, push: false }));
      await updatePreferences({ ...preferences, push: false });
    }
  };

  const handleTypeToggle = async (typeId: string) => {
    const newTypes = preferences.types.includes(typeId)
      ? preferences.types.filter(t => t !== typeId)
      : [...preferences.types, typeId];
    
    setPreferences(prev => ({ ...prev, types: newTypes }));
    await updatePreferences({ ...preferences, types: newTypes });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
            </div>
            <button
              onClick={() => {
                setPreferences(prev => ({ ...prev, email: !prev.email }));
                updatePreferences({ ...preferences, email: !preferences.email });
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.email ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.email ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications in your browser</p>
              </div>
            </div>
            {pushPermission === 'denied' ? (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                Blocked by browser
              </div>
            ) : (
              <button
                onClick={handlePushToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.push ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.push ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Types</h3>
        <div className="space-y-4">
          {notificationTypes.map((type) => (
            <div key={type.id} className="flex items-center justify-between">
              <label htmlFor={type.id} className="text-sm text-gray-900">
                {type.label}
              </label>
              <button
                onClick={() => handleTypeToggle(type.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.types.includes(type.id) ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.types.includes(type.id) ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}