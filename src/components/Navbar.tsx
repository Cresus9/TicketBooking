import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Search, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Ticket className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">AfriTix</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <Link to="/events" className="text-gray-600 hover:text-indigo-600">Events</Link>
            <Link to="/categories" className="text-gray-600 hover:text-indigo-600">Categories</Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
                <User className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-lg p-2 hover:bg-gray-100 focus:outline-none"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <Link to="/events" className="text-gray-600 hover:text-indigo-600 px-2 py-1">Events</Link>
              <Link to="/categories" className="text-gray-600 hover:text-indigo-600 px-2 py-1">Categories</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 px-2 py-1">Dashboard</Link>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-indigo-600 px-2 py-1 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 px-2 py-1">Login</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}