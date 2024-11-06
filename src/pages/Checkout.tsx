import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CheckoutForm from '../components/booking/CheckoutForm';

interface CheckoutState {
  tickets: { [key: string]: number };
  eventId: string;
  subtotal: number;
  processingFee: number;
  total: number;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CheckoutState;

  if (!state?.tickets) {
    navigate('/events');
    return null;
  }

  const handlePaymentSuccess = (bookingId: string) => {
    navigate(`/booking/confirmation/${bookingId}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Event
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your purchase to secure your tickets</p>
      </div>

      <CheckoutForm
        tickets={state.tickets}
        totalAmount={state.total}
        currency="GHS"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}