import React, { useState } from 'react';
import { Bell, Mail, Calendar } from 'lucide-react';

export default function Notifications() {
  const [emailNotifications, setEmailNotifications] = useState({
    events: true,
    reminders: true,
    updates: false,
    marketing: false
  });

  const [pushNotifications, setPushNotifications] = useState({
    events: true,
    reminders: true,
    updates: true,
    marketing: false
  });

  const handleEmailToggle = (key: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePushToggle = (key: keyof typeof pushNotifications) => {
    setPushNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h1>

      {/* Email Notifications */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Email Notifications</h2>
        </div>
        <div className="space-y-4">
          {Object.entries(emailNotifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 capitalize">{key}</p>
                <p className="text-sm text-gray-600">
                  {key === 'events' && 'Get notified about your upcoming events'}
                  {key === 'reminders' && 'Receive event reminders'}
                  {key === 'updates' && 'Stay updated with platform changes'}
                  {key === 'marketing' && 'Receive promotional offers and updates'}
                </p>
              </div>
              <button
                onClick={() => handleEmailToggle(key as keyof typeof emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Push Notifications</h2>
        </div>
        <div className="space-y-4">
          {Object.entries(pushNotifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 capitalize">{key}</p>
                <p className="text-sm text-gray-600">
                  {key === 'events' && 'Get instant notifications about your events'}
                  {key === 'reminders' && 'Receive timely event reminders'}
                  {key === 'updates' && 'Get notified about important updates'}
                  {key === 'marketing' && 'Receive promotional notifications'}
                </p>
              </div>
              <button
                onClick={() => handlePushToggle(key as keyof typeof pushNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Settings */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Notification Schedule</h2>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-4">
            Choose when you'd like to receive notifications. We'll only send them during your preferred hours.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                defaultValue="09:00"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                defaultValue="21:00"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}