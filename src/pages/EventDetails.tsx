import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import TicketSelection from '../components/TicketSelection';
import { Calendar, MapPin, Clock, Share2, Heart, ArrowRight, Ticket } from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEvent } = useEvents();
  const event = getEvent(id || '');
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({});

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
      </div>
    );
  }

  const handleTicketSelect = (tickets: { [key: string]: number }) => {
    setSelectedTickets(tickets);
  };

  const calculateSubtotal = () => {
    const ticketPrices = {
      regular: 50,
      vip: 150,
      vvip: 300
    };

    return Object.entries(selectedTickets).reduce((total, [type, quantity]) => {
      return total + (ticketPrices[type as keyof typeof ticketPrices] * quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const processingFee = subtotal * 0.02;
  const total = subtotal + processingFee;

  const handleProceedToCheckout = () => {
    // Navigate to checkout with selected tickets
    navigate('/checkout', { 
      state: { 
        tickets: selectedTickets,
        eventId: id,
        subtotal,
        processingFee,
        total
      } 
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Event Header */}
      <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
              <div className="flex items-center gap-6 text-white/90">
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {event.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {event.time}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {event.location}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                <Share2 className="h-6 w-6 text-white" />
              </button>
              <button className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                <Heart className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Ticket Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <TicketSelection
              eventId={event.id}
              onTicketSelect={handleTicketSelect}
            />
          </div>
        </div>

        {/* Sticky Order Summary */}
        <div className="lg:relative">
          <div className="lg:sticky lg:top-8">
            {Object.values(selectedTickets).some(qty => qty > 0) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Ticket className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                </div>

                {/* Selected Tickets */}
                <div className="space-y-4 mb-6">
                  {Object.entries(selectedTickets).map(([type, quantity]) => {
                    if (quantity === 0) return null;
                    const price = type === 'regular' ? 50 : type === 'vip' ? 150 : 300;
                    return (
                      <div key={type} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">
                            {type.charAt(0).toUpperCase() + type.slice(1)} Ticket
                          </p>
                          <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">
                          GHS {price * quantity}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>GHS {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Processing Fee (2%)</span>
                    <span>GHS {processingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2">
                    <span>Total</span>
                    <span>GHS {total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mt-6"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5" />
                </button>

                <p className="text-sm text-gray-500 text-center mt-4">
                  Tickets will be sent to your email after purchase
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}