import React from 'react';
import { Filter, Calendar, MapPin, Tag, DollarSign } from 'lucide-react';

interface SearchFiltersProps {
  filters: {
    date: string;
    location: string;
    category: string;
    priceRange: string;
  };
  locations: string[];
  categories: string[];
  priceRanges: Array<{ min: number; max: number }>;
  onChange: (key: string, value: string) => void;
}

export default function SearchFilters({
  filters,
  locations,
  categories,
  priceRanges,
  onChange
}: SearchFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onChange('date', e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={filters.location}
            onChange={(e) => onChange('location', e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={filters.category}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={filters.priceRange}
            onChange={(e) => onChange('priceRange', e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Any Price</option>
            {priceRanges.map(range => (
              <option
                key={`${range.min}-${range.max}`}
                value={`${range.min}-${range.max}`}
              >
                {range.max
                  ? `GHS ${range.min} - ${range.max}`
                  : `GHS ${range.min}+`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}