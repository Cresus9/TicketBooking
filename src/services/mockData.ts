export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  price: number;
  currency: string;
  capacity: number;
  ticketsSold: number;
  status: 'upcoming' | 'past' | 'draft';
  categories: string[];
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Afro Nation Ghana 2024',
    description: 'The biggest Afrobeats festival in Africa returns to Ghana for another unforgettable experience.',
    date: '2024-12-15',
    time: '18:00',
    location: 'Accra Sports Stadium',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
    price: 150,
    currency: 'GHS',
    capacity: 20000,
    ticketsSold: 15000,
    status: 'upcoming',
    categories: ['Music', 'Festival']
  },
  {
    id: '2',
    title: 'Lagos Jazz Festival',
    description: 'A celebration of jazz music featuring top artists from across Africa.',
    date: '2024-11-20',
    time: '19:30',
    location: 'Eko Hotel & Suites',
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae',
    price: 25000,
    currency: 'NGN',
    capacity: 5000,
    ticketsSold: 3500,
    status: 'upcoming',
    categories: ['Music', 'Jazz']
  },
  {
    id: '3',
    title: 'African Athletics Championship',
    description: 'Top athletes from across the continent compete in various track and field events.',
    date: '2024-09-10',
    time: '09:00',
    location: 'National Stadium, Nairobi',
    imageUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff',
    price: 1000,
    currency: 'KES',
    capacity: 30000,
    ticketsSold: 20000,
    status: 'upcoming',
    categories: ['Sports']
  }
];

export const mockEventService = {
  getAll: () => Promise.resolve(mockEvents),
  getById: (id: string) => Promise.resolve(mockEvents.find(event => event.id === id)),
  getFeaturedEvents: () => Promise.resolve(
    mockEvents
      .filter(event => event.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3)
  ),
  create: (event: Omit<Event, 'id'>) => {
    const newEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9)
    };
    mockEvents.push(newEvent);
    return Promise.resolve(newEvent);
  },
  update: (id: string, event: Partial<Event>) => {
    const index = mockEvents.findIndex(e => e.id === id);
    if (index === -1) return Promise.reject(new Error('Event not found'));
    mockEvents[index] = { ...mockEvents[index], ...event };
    return Promise.resolve(mockEvents[index]);
  },
  delete: (id: string) => {
    const index = mockEvents.findIndex(e => e.id === id);
    if (index === -1) return Promise.reject(new Error('Event not found'));
    mockEvents.splice(index, 1);
    return Promise.resolve();
  }
};

export interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalRevenue: number;
  ticketsSold: number;
  recentOrders: any[];
  userGrowth: any[];
  salesByCategory: any[];
}

const generateMockDashboardStats = (): DashboardStats => {
  return {
    totalUsers: 2543,
    totalEvents: 45,
    totalRevenue: 125430,
    ticketsSold: 1234,
    recentOrders: [
      {
        id: 'ORD-001',
        user: { name: 'John Doe' },
        event: { title: 'Afro Nation Ghana 2024' },
        total: 500,
        status: 'completed'
      },
      {
        id: 'ORD-002',
        user: { name: 'Jane Smith' },
        event: { title: 'Lagos Jazz Festival' },
        total: 300,
        status: 'pending'
      },
      {
        id: 'ORD-003',
        user: { name: 'Mike Johnson' },
        event: { title: 'African Athletics Championship' },
        total: 200,
        status: 'completed'
      }
    ],
    userGrowth: [
      { date: '2024-01', value: 150 },
      { date: '2024-02', value: 280 },
      { date: '2024-03', value: 420 },
      { date: '2024-04', value: 650 },
      { date: '2024-05', value: 850 }
    ],
    salesByCategory: [
      { category: 'Music', total: 45000 },
      { category: 'Sports', total: 35000 },
      { category: 'Cultural', total: 25000 },
      { category: 'Arts', total: 15000 },
      { category: 'Other', total: 5000 }
    ]
  };
};

export const mockAnalyticsService = {
  getDashboardStats: () => Promise.resolve(generateMockDashboardStats())
};