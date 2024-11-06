import React, { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface TicketAvailabilityIndicatorProps {
  eventId: string;
  ticketType: string;
  initialAvailable: number;
  totalCapacity: number;
}

export default function TicketAvailabilityIndicator({
  eventId,
  ticketType,
  initialAvailable,
  totalCapacity
}: TicketAvailabilityIndicatorProps) {
  const [available, setAvailable] = useState(initialAvailable);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Join event room for real-time updates
    socket.emit('joinEvent', eventId);

    // Listen for ticket availability updates
    socket.on('ticketUpdate', (data: { type: string; available: number }) => {
      if (data.type === ticketType) {
        setAvailable(data.available);
      }
    });

    return () => {
      socket.off('ticketUpdate');
      socket.emit('leaveEvent', eventId);
    };
  }, [socket, eventId, ticketType]);

  const availabilityPercentage = (available / totalCapacity) * 100;

  const getStatusInfo = () => {
    if (availabilityPercentage <= 10) {
      return {
        text: 'Almost Sold Out',
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      };
    } else if (availabilityPercentage <= 50) {
      return {
        text: 'Selling Fast',
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      };
    }
    return {
      text: 'Available',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    };
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-2">
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status.bgColor} ${status.color}`}>
        <StatusIcon className="h-4 w-4" />
        <span className="text-sm font-medium">{status.text}</span>
      </div>
      
      <div className="w-full">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${availabilityPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-sm text-gray-600">{available} tickets left</span>
          <span className="text-sm text-gray-600">{totalCapacity} total</span>
        </div>
      </div>

      {availabilityPercentage <= 20 && (
        <p className="text-sm text-red-600">
          Only {available} tickets remaining! Book now to avoid disappointment.
        </p>
      )}
    </div>
  );
}