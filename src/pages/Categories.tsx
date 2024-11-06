import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, Theater, Trophy, Users, Palette, Mic, BookOpen, Camera, Search, TrendingUp } from 'lucide-react';

const categories = [
  {
    name: 'Music Concerts',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae',
    description: 'Live performances from top artists and bands',
    subcategories: ['Rock', 'Jazz', 'Afrobeats', 'Classical', 'Hip Hop'],
    upcomingEvents: 24,
    trending: true
  },
  {
    name: 'Sports Events',
    icon: Trophy,
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20',
    description: 'Major sporting events and tournaments',
    subcategories: ['Football', 'Basketball', 'Athletics', 'Boxing', 'Rugby'],
    upcomingEvents: 32,
    trending: true
  },
  {
    name: 'Cultural Festivals',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    description: 'Celebrations of African culture and heritage',
    subcategories: ['Food Festivals', 'Traditional Ceremonies', 'Art Fairs', 'Cultural Exhibitions'],
    upcomingEvents: 15,
    trending: true
  },
  {
    name: 'Art Exhibitions',
    icon: Palette,
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
    description: 'Visual art showcases and gallery events',
    subcategories: ['Contemporary Art', 'Photography', 'Sculpture', 'Digital Art'],
    upcomingEvents: 21,
    trending: false
  },
  {
    name: 'Stand-up Comedy',
    icon: Mic,
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca',
    description: 'Live comedy shows and performances',
    subcategories: ['Stand-up', 'Improv', 'Sketch Comedy', 'Comedy Festivals'],
    upcomingEvents: 12,
    trending: false
  },
  {
    name: 'Literary Events',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1526721940322-10fb6e3ae94a',
    description: 'Book launches and literary festivals',
    subcategories: ['Book Launches', 'Poetry Readings', 'Writing Workshops', 'Literary Festivals'],
    upcomingEvents: 8,
    trending: false
  },
  {
    name: 'Athletics',
    icon: Trophy,
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5',
    description: 'Track and field competitions and championships',
    subcategories: ['Track Events', 'Field Events', 'Marathon', 'Cross Country'],
    upcomingEvents: 16,
    trending: false
  },
  {
    name: 'Combat Sports',
    icon: Trophy,
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed',
    description: 'Boxing, martial arts, and combat sports events',
    subcategories: ['Boxing', 'MMA', 'Wrestling', 'Martial Arts'],
    upcomingEvents: 10,
    trending: false
  }
];

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const trendingCategories = categories.filter(category => category.trending);

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Event Categories</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Discover a wide range of events across different categories. From music concerts to cultural festivals,
          find experiences that match your interests.
        </p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Trending Categories */}
      {!searchTerm && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Trending Categories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCategories.map((category) => (
              <div
                key={category.name}
                className="relative h-48 rounded-xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <category.icon className="h-10 w-10 mb-3" />
                  <h3 className="text-xl font-semibold text-center mb-2">{category.name}</h3>
                  <span className="px-3 py-1 bg-indigo-600 rounded-full text-sm">
                    {category.upcomingEvents} Upcoming Events
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.name}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="relative h-48">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 text-white mb-1">
                  <category.icon className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </div>
                <span className="text-sm text-white/90">{category.upcomingEvents} Upcoming Events</span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Popular in this category:</h4>
                <div className="flex flex-wrap gap-2">
                  {category.subcategories.slice(0, 3).map((subcategory) => (
                    <span
                      key={subcategory}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                    >
                      {subcategory}
                    </span>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      +{category.subcategories.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <Link
                to={`/events?category=${encodeURIComponent(category.name)}`}
                className="mt-4 inline-block w-full text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View Events
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}