import React from 'react';
import { useRealtime } from '../../context/RealtimeContext';

interface UserPresenceProps {
  userId: string;
  userName: string;
}

export default function UserPresence({ userId, userName }: UserPresenceProps) {
  const { onlineUsers } = useRealtime();
  const isOnline = onlineUsers.has(userId);

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-sm font-medium">{userName[0]}</span>
        </div>
        <div
          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{userName}</p>
        <p className="text-xs text-gray-500">{isOnline ? 'Online' : 'Offline'}</p>
      </div>
    </div>
  );
}