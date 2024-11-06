import React, { useState } from 'react';
import { FileText, Image, Link as LinkIcon, Plus, Edit2, Trash2 } from 'lucide-react';

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('pages');

  const tabs = [
    { id: 'pages', label: 'Pages' },
    { id: 'banners', label: 'Banners' },
    { id: 'faqs', label: 'FAQs' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="h-5 w-5" />
          Add Content
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm">
        {activeTab === 'pages' && (
          <div className="divide-y divide-gray-200">
            {[
              { title: 'Home Page', path: '/', lastUpdated: '2024-03-15' },
              { title: 'About Us', path: '/about', lastUpdated: '2024-03-14' },
              { title: 'Terms of Service', path: '/terms', lastUpdated: '2024-03-13' }
            ].map((page) => (
              <div key={page.path} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{page.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <LinkIcon className="h-4 w-4" />
                      {page.path}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    Last updated: {new Date(page.lastUpdated).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100">
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="relative group">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${index}`}
                    alt={`Banner ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button className="p-2 bg-white rounded-lg text-gray-700 hover:text-indigo-600">
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button className="p-2 bg-white rounded-lg text-gray-700 hover:text-red-600">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="font-medium text-gray-900">Banner {index}</h3>
                  <p className="text-sm text-gray-500">Active • Home Page</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="divide-y divide-gray-200">
            {[
              {
                question: 'How do I purchase tickets?',
                answer: 'You can purchase tickets directly through our website...',
                category: 'Tickets'
              },
              {
                question: 'What is your refund policy?',
                answer: 'We offer full refunds up to 48 hours before the event...',
                category: 'Payments'
              },
              {
                question: 'Can I transfer my ticket to someone else?',
                answer: 'Yes, you can transfer your ticket through your account...',
                category: 'Tickets'
              }
            ].map((faq, index) => (
              <div key={index} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                      {faq.category}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100">
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}