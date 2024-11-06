import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Star, Shield, CreditCard, Users } from 'lucide-react';
import FeaturedEvents from '../components/FeaturedEvents';
import HomeSearch from '../components/search/HomeSearch';

export default function Home() {
  return (
    <div className="-mt-8">
      {/* Hero Section */}
      <section className="relative h-[600px] mb-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Experience the Best Events <br />Across Africa
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl">
            Discover and book tickets to concerts, festivals, cultural events, and more. Your gateway to unforgettable experiences.
          </p>
          
          <HomeSearch />
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white rounded-2xl shadow-sm p-8">
            {[
              { label: 'Events', value: '1,000+' },
              { label: 'Cities', value: '50+' },
              { label: 'Organizers', value: '500+' },
              { label: 'Happy Attendees', value: '100K+' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <FeaturedEvents />

      {/* Categories Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h2>
              <p className="text-gray-600">Find events that match your interests</p>
            </div>
            <Link to="/categories" className="text-indigo-600 hover:text-indigo-700 font-medium">
              View all categories →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Music', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae' },
              { name: 'Sports', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20' },
              { name: 'Cultural', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3' },
              { name: 'Arts', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b' }
            ].map((category) => (
              <Link
                key={category.name}
                to={`/events?category=${encodeURIComponent(category.name.toLowerCase())}`}
                className="relative h-48 rounded-xl overflow-hidden group"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose AfriTix</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best event booking experience with features designed for your convenience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Ticket,
                title: 'Easy Booking',
                description: 'Simple and secure ticket booking process'
              },
              {
                icon: Shield,
                title: 'Secure Payments',
                description: 'Multiple safe payment options available'
              },
              {
                icon: CreditCard,
                title: 'Instant Confirmation',
                description: 'Get your e-tickets delivered instantly'
              },
              {
                icon: Star,
                title: 'Exclusive Events',
                description: 'Access to premium and VIP experiences'
              }
            ].map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-xl shadow-sm">
                <feature.icon className="h-10 w-10 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Amazing Events?</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of event-goers and discover the best events happening across Africa
          </p>
          <Link
            to="/events"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
          >
            Explore Events
          </Link>
        </div>
      </section>
    </div>
  );
}