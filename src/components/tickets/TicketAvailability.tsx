import React, { useEffect, useState } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface TicketAvailabilityProps {
  eventId: string;
  ticketType: string;
  initialAvailable: number;
  totalCapacity: number;
}

export default function TicketAvailability({
  eventId,
  ticketType,
  initialAvailable,
  totalCapacity
}: TicketAvailabilityProps) {
  const [available, setAvailable] = useState(initialAvailable);
  const { socket, joinEventRoom, leaveEventRoom } = useRealtime();

  useEffect(() => {
    joinEventRoom(eventId);

    socket?.on('ticketUpdate', (data: { type: string; available: number }) => {
      if (data.type === ticketType) {
        setAvailable(data.available);
      }
    });

    return () => {
      leaveEventRoom(eventId);
      socket?.off('ticketUpdate');
    };
  }, [eventId, socket, ticketType]);

  const availabilityPercentage = (available / totalCapacity) * 100;

  const getAvailabilityStatus = () => {
    if (availabilityPercentage <= 10) {
      return {
        text: 'Almost Sold Out',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: AlertCircle
      };
    } else if (availabilityPercentage <= 50) {
      return {
        text: 'Selling Fast',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        icon: Clock
      };
    }
    return {
      text: 'Available',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: CheckCircle
    };
  };

  const status = getAvailabilityStatus();

  return (
    <div className="flex items-center gap-4">
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bgColor} ${status.color}`}>
        <status.icon className="h-4 w-4" />
        <span className="text-sm font-medium">{status.text}</span>
      </div>
      <div className="flex-1">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${availabilityPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {available} tickets remaining
        </p>
      </div>
    </div>
  );
}