import React, { useState } from 'react';
import { Minus, Plus, Info, Ticket } from 'lucide-react';

interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  available: number;
  maxPerOrder: number;
  benefits: string[];
}

interface TicketSelectionProps {
  eventId: string;
  onTicketSelect: (tickets: { [key: string]: number }) => void;
}

export default function TicketSelection({ eventId, onTicketSelect }: TicketSelectionProps) {
  // Mock ticket types - in a real app, this would come from an API
  const ticketTypes: TicketType[] = [
    {
      id: 'regular',
      name: 'Regular Ticket',
      description: 'Standard event access',
      price: 50,
      currency: 'GHS',
      available: 100,
      maxPerOrder: 4,
      benefits: ['Event entry', 'Access to main areas']
    },
    {
      id: 'vip',
      name: 'VIP Ticket',
      description: 'Premium event experience',
      price: 150,
      currency: 'GHS',
      available: 50,
      maxPerOrder: 2,
      benefits: [
        'Priority entry',
        'VIP seating',
        'Complimentary drinks',
        'Meet & greet opportunity'
      ]
    },
    {
      id: 'vvip',
      name: 'VVIP Ticket',
      description: 'Ultimate luxury experience',
      price: 300,
      currency: 'GHS',
      available: 20,
      maxPerOrder: 2,
      benefits: [
        'Exclusive entrance',
        'Premium seating',
        'Full catering service',
        'Backstage access',
        'Private lounge access',
        'Personal concierge'
      ]
    }
  ];

  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>(
    ticketTypes.reduce((acc, ticket) => ({ ...acc, [ticket.id]: 0 }), {})
  );

  const [showBenefits, setShowBenefits] = useState<{ [key: string]: boolean }>(
    ticketTypes.reduce((acc, ticket) => ({ ...acc, [ticket.id]: false }), {})
  );

  const handleQuantityChange = (ticketId: string, delta: number) => {
    const ticket = ticketTypes.find(t => t.id === ticketId);
    if (!ticket) return;

    const currentQty = selectedTickets[ticketId];
    const newQty = Math.max(0, Math.min(currentQty + delta, ticket.maxPerOrder, ticket.available));

    const updatedTickets = {
      ...selectedTickets,
      [ticketId]: newQty
    };

    setSelectedTickets(updatedTickets);
    onTicketSelect(updatedTickets);
  };

  const calculateTotal = () => {
    return ticketTypes.reduce((total, ticket) => {
      return total + (ticket.price * selectedTickets[ticket.id]);
    }, 0);
  };

  const toggleBenefits = (ticketId: string) => {
    setShowBenefits(prev => ({
      ...prev,
      [ticketId]: !prev[ticketId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Ticket className="h-6 w-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">Select Tickets</h2>
      </div>

      {/* Ticket Types */}
      <div className="space-y-4">
        {ticketTypes.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{ticket.name}</h3>
                  <p className="text-gray-600">{ticket.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {ticket.currency} {ticket.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    {ticket.available} tickets left
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-4">
                <button
                  onClick={() => toggleBenefits(ticket.id)}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <Info className="h-4 w-4" />
                  {showBenefits[ticket.id] ? 'Hide benefits' : 'Show benefits'}
                </button>
                {showBenefits[ticket.id] && (
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    {ticket.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(ticket.id, -1)}
                    disabled={selectedTickets[ticket.id] === 0}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {selectedTickets[ticket.id]}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(ticket.id, 1)}
                    disabled={
                      selectedTickets[ticket.id] >= ticket.maxPerOrder ||
                      selectedTickets[ticket.id] >= ticket.available
                    }
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {selectedTickets[ticket.id] > 0 && (
                  <p className="font-medium text-gray-900">
                    {ticket.currency} {ticket.price * selectedTickets[ticket.id]}
                  </p>
                )}
              </div>

              {/* Max Per Order Notice */}
              <p className="mt-2 text-sm text-gray-500">
                Maximum {ticket.maxPerOrder} tickets per order
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      {Object.values(selectedTickets).some(qty => qty > 0) && (
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2">
            {ticketTypes.map((ticket) => (
              selectedTickets[ticket.id] > 0 && (
                <div key={ticket.id} className="flex justify-between text-gray-600">
                  <span>{ticket.name} × {selectedTickets[ticket.id]}</span>
                  <span>{ticket.currency} {ticket.price * selectedTickets[ticket.id]}</span>
                </div>
              )
            ))}
            <div className="border-t border-gray-200 pt-2 mt-4">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>{ticketTypes[0].currency} {calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}