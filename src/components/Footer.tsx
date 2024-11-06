import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, Ticket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">AfriTix</span>
            </div>
            <p className="text-gray-600 mb-4">
              Your trusted platform for discovering and booking amazing events across Africa.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/events" className="text-gray-600 hover:text-indigo-600">All Events</Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-600 hover:text-indigo-600">Categories</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-indigo-600">About Us</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-indigo-600">Blog</Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-indigo-600">Careers</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-indigo-600">Help Center</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-indigo-600">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-indigo-600">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-indigo-600">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-indigo-600">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5 text-indigo-600" />
                <span>123 Innovation Hub, Accra, Ghana</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="h-5 w-5 text-indigo-600" />
                <span>+233 (0) 123 456 789</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="h-5 w-5 text-indigo-600" />
                <span>support@afritix.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-100 pt-8 pb-4">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-gray-900 font-semibold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-gray-600 mb-4">Stay updated with the latest events and offers</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} AfriTix. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/terms" className="text-sm text-gray-600 hover:text-indigo-600">Terms</Link>
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-indigo-600">Privacy</Link>
              <Link to="/cookies" className="text-sm text-gray-600 hover:text-indigo-600">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}