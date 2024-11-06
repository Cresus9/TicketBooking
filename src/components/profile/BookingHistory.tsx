import React from 'react';
import { Download, Calendar, MapPin, Clock } from 'lucide-react';

const bookings = [
  {
    id: '1',
    eventName: 'Afro Nation Ghana 2024',
    date: 'Dec 15, 2024',
    time: '18:00',
    location: 'Accra Sports Stadium',
    status: 'upcoming',
    ticketType: 'VIP',
    price: 150,
    currency: 'GHS',
    ticketId: 'TIX-123456'
  },
  {
    id: '2',
    eventName: 'Lagos Jazz Festival',
    date: 'Nov 20, 2024',
    time: '19:30',
    location: 'Eko Hotel & Suites',
    status: 'completed',
    ticketType: 'Regular',
    price: 25000,
    currency: 'NGN',
    ticketId: 'TIX-789012'
  }
];

export default function BookingHistory() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Booking History</h1>
      
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {booking.eventName}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {booking.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {booking.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {booking.location}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'upcoming'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {booking.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Ticket Type</p>
                  <p className="font-medium text-gray-900">{booking.ticketType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Ticket ID</p>
                  <p className="font-medium text-gray-900">{booking.ticketId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-medium text-gray-900">
                    {booking.currency} {booking.price}
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  <Download className="h-4 w-4" />
                  Download Ticket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}