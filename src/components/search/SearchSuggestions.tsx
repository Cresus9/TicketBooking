import React from 'react';
import { Search, Clock, TrendingUp } from 'lucide-react';

interface SearchSuggestionsProps {
  suggestions: string[];
  recentSearches: string[];
  popularSearches: string[];
  onSelect: (query: string) => void;
}

export default function SearchSuggestions({
  suggestions,
  recentSearches,
  popularSearches,
  onSelect
}: SearchSuggestionsProps) {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 divide-y divide-gray-100">
      {/* Current Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSelect(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2"
            >
              <Search className="h-4 w-4 text-gray-400" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="p-2">
          <p className="px-4 py-1 text-xs font-medium text-gray-500">Recent Searches</p>
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => onSelect(search)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2"
            >
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{search}</span>
            </button>
          ))}
        </div>
      )}

      {/* Popular Searches */}
      {popularSearches.length > 0 && (
        <div className="p-2">
          <p className="px-4 py-1 text-xs font-medium text-gray-500">Popular Searches</p>
          {popularSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => onSelect(search)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <span>{search}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}