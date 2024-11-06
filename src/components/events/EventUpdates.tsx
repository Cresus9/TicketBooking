import React, { useEffect, useState } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { AlertCircle, Clock, Users, Ticket } from 'lucide-react';

interface EventUpdate {
  id: string;
  type: 'ticket' | 'attendance' | 'general';
  message: string;
  timestamp: string;
}

interface EventUpdatesProps {
  eventId: string;
}

export default function EventUpdates({ eventId }: EventUpdatesProps) {
  const [updates, setUpdates] = useState<EventUpdate[]>([]);
  const { socket, joinEventRoom, leaveEventRoom } = useRealtime();

  useEffect(() => {
    joinEventRoom(eventId);

    socket?.on('eventUpdate', (update: EventUpdate) => {
      setUpdates(prev => [update, ...prev]);
    });

    socket?.on('ticketUpdate', (update: EventUpdate) => {
      setUpdates(prev => [update, ...prev]);
    });

    return () => {
      leaveEventRoom(eventId);
      socket?.off('eventUpdate');
      socket?.off('ticketUpdate');
    };
  }, [eventId, socket]);

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'ticket':
        return <Ticket className="h-5 w-5 text-indigo-600" />;
      case 'attendance':
        return <Users className="h-5 w-5 text-green-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Updates</h3>
      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="flex items-start gap-3">
            {getUpdateIcon(update.type)}
            <div className="flex-1">
              <p className="text-gray-900">{update.message}</p>
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{new Date(update.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))}
        {updates.length === 0 && (
          <p className="text-center text-gray-500 py-4">No updates yet</p>
        )}
      </div>
    </div>
  );
}