import { mockEventService } from './mockData';

export interface SearchFilters {
  query?: string;
  date?: string;
  location?: string;
  category?: string;
  priceRange?: string;
  sortBy?: string;
}

export interface SearchResults {
  events: any[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PriceRange {
  min: number;
  max: number | null;
  label: string;
}

class SearchService {
  async searchEvents(filters: SearchFilters): Promise<SearchResults> {
    const events = await mockEventService.getAll();
    const filteredEvents = events.filter(event => {
      const matchesQuery = !filters.query || 
        event.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        event.location.toLowerCase().includes(filters.query.toLowerCase());
      
      const matchesLocation = !filters.location || event.location === filters.location;
      const matchesCategory = !filters.category || event.categories.includes(filters.category);
      
      let matchesPriceRange = true;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        matchesPriceRange = max ? 
          (event.price >= min && event.price <= max) :
          event.price >= min;
      }
      
      return matchesQuery && matchesLocation && matchesCategory && matchesPriceRange;
    });

    return {
      events: filteredEvents,
      total: filteredEvents.length,
      page: 1,
      totalPages: 1
    };
  }

  async getLocations(): Promise<string[]> {
    const events = await mockEventService.getAll();
    const locations = new Set(events.map(event => event.location));
    return Array.from(locations);
  }

  async getCategories(): Promise<string[]> {
    const events = await mockEventService.getAll();
    const categories = new Set(events.flatMap(event => event.categories));
    return Array.from(categories);
  }

  async getPriceRanges(): Promise<PriceRange[]> {
    return [
      { min: 0, max: 50, label: 'Under GHS 50' },
      { min: 50, max: 100, label: 'GHS 50 - 100' },
      { min: 100, max: 200, label: 'GHS 100 - 200' },
      { min: 200, max: null, label: 'GHS 200+' }
    ];
  }

  async getPopularSearches(): Promise<string[]> {
    return [
      'Music Festivals',
      'Sports Events',
      'Cultural Events',
      'Art Exhibitions',
      'Comedy Shows'
    ];
  }

  async getSuggestions(query: string): Promise<string[]> {
    const events = await mockEventService.getAll();
    return events
      .filter(event => 
        event.title.toLowerCase().includes(query.toLowerCase())
      )
      .map(event => event.title)
      .slice(0, 5);
  }
}

export const searchService = new SearchService();