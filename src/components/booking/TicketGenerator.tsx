import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Clock, User, Ticket } from 'lucide-react';

interface TicketProps {
  bookingId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketType: string;
  ticketHolder: string;
  qrData: string;
}

export default function TicketGenerator({
  bookingId,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  ticketType,
  ticketHolder,
  qrData
}: TicketProps) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
      {/* Ticket Header */}
      <div className="bg-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="h-6 w-6" />
            <span className="text-xl font-bold">AfriTix</span>
          </div>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {ticketType}
          </span>
        </div>
      </div>

      {/* Ticket Content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{eventTitle}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-5 w-5" />
            <span>{eventDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-5 w-5" />
            <span>{eventTime}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-5 w-5" />
            <span>{eventLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-5 w-5" />
            <span>{ticketHolder}</span>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white rounded-xl shadow-sm">
            <QRCodeSVG value={qrData} size={160} />
          </div>
        </div>

        {/* Booking Reference */}
        <div className="text-center">
          <p className="text-sm text-gray-600">Booking Reference</p>
          <p className="text-lg font-mono font-bold text-gray-900">{bookingId}</p>
        </div>
      </div>

      {/* Ticket Footer */}
      <div className="border-t border-gray-200 p-4">
        <p className="text-sm text-gray-600 text-center">
          This ticket is valid for one-time entry. Please present this QR code at the venue.
        </p>
      </div>
    </div>
  );
}