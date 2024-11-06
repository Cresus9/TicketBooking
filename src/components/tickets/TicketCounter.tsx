import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface TicketCounterProps {
  available: number;
  quantity: number;
  maxPerOrder: number;
  onChange: (quantity: number) => void;
}

export default function TicketCounter({
  available,
  quantity,
  maxPerOrder,
  onChange
}: TicketCounterProps) {
  const increment = () => {
    if (quantity < Math.min(available, maxPerOrder)) {
      onChange(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 0) {
      onChange(quantity - 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={decrement}
        disabled={quantity === 0}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-12 text-center font-medium">{quantity}</span>
      <button
        onClick={increment}
        disabled={quantity >= Math.min(available, maxPerOrder)}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="h-4 w-4" />
      </button>
      {quantity === maxPerOrder && (
        <span className="text-sm text-orange-600">Max per order</span>
      )}
    </div>
  );
}