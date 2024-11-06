import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, AlertCircle } from 'lucide-react';

interface CheckoutFormProps {
  tickets: { [key: string]: number };
  totalAmount: number;
  currency: string;
  onSuccess: (bookingId: string) => void;
}

export default function CheckoutForm({ tickets, totalAmount, currency, onSuccess }: CheckoutFormProps) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_money'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock booking ID
      const bookingId = `BK-${Math.random().toString(36).substr(2, 9)}`;
      onSuccess(bookingId);
      
      navigate(`/booking/confirmation/${bookingId}`);
    } catch (error) {
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 flex items-center gap-3 p-4 border rounded-lg ${
                paymentMethod === 'card'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <CreditCard className={`h-5 w-5 ${
                paymentMethod === 'card' ? 'text-indigo-600' : 'text-gray-400'
              }`} />
              <div className="text-left">
                <p className={`font-medium ${
                  paymentMethod === 'card' ? 'text-indigo-600' : 'text-gray-900'
                }`}>
                  Card Payment
                </p>
                <p className="text-sm text-gray-600">Pay with credit or debit card</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('mobile_money')}
              className={`flex-1 flex items-center gap-3 p-4 border rounded-lg ${
                paymentMethod === 'mobile_money'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Wallet className={`h-5 w-5 ${
                paymentMethod === 'mobile_money' ? 'text-indigo-600' : 'text-gray-400'
              }`} />
              <div className="text-left">
                <p className={`font-medium ${
                  paymentMethod === 'mobile_money' ? 'text-indigo-600' : 'text-gray-900'
                }`}>
                  Mobile Money
                </p>
                <p className="text-sm text-gray-600">Pay with mobile money</p>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {paymentMethod === 'card' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Money Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your mobile number"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Provider
                </label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="mtn">MTN Mobile Money</option>
                  <option value="vodafone">Vodafone Cash</option>
                  <option value="airteltigo">AirtelTigo Money</option>
                </select>
              </div>
            </>
          )}

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>{currency} {totalAmount}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Processing Fee</span>
              <span>{currency} {(totalAmount * 0.02).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 text-lg pt-2">
              <span>Total</span>
              <span>{currency} {(totalAmount * 1.02).toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing Payment...</span>
              </div>
            ) : (
              `Pay ${currency} ${(totalAmount * 1.02).toFixed(2)}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}