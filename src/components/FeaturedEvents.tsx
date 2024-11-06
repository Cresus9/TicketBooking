import React from 'react';
import EventCard from './EventCard';
import { useEvents } from '../context/EventContext';
import { Loader } from 'lucide-react';

export default function FeaturedEvents() {
  const { featuredEvents, loading, error } = useEvents();

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader className="h-5 w-5 animate-spin" />
          <span>Loading events...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!featuredEvents || featuredEvents.length === 0) {
    return (
      <div className="py-12 text-center text-gray-600">
        <p>No featured events available at the moment.</p>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
        <a href="/events" className="text-indigo-600 hover:text-indigo-700 font-medium">
          View all events →
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredEvents.map((event) => (
          <EventCard 
            key={event.id} 
            id={event.id}
            title={event.title}
            date={event.date}
            time={event.time}
            location={event.location}
            imageUrl={event.imageUrl}
            price={event.price}
            currency={event.currency}
          />
        ))}
      </div>
    </section>
  );
}