import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import RevenueChart from '../../components/admin/charts/RevenueChart';
import TicketSalesChart from '../../components/admin/charts/TicketSalesChart';
import UserGrowthChart from '../../components/admin/charts/UserGrowthChart';
import CategoryDistributionChart from '../../components/admin/charts/CategoryDistributionChart';

interface AnalyticsData {
  totalRevenue: number;
  ticketsSold: number;
  activeUsers: number;
  eventsCreated: number;
  revenueData: { labels: string[]; values: number[] };
  ticketSalesData: { labels: string[]; values: number[] };
  userGrowthData: { labels: string[]; values: number[] };
  categoryData: { labels: string[]; values: number[] };
  topEvents: Array<{
    id: string;
    title: string;
    ticketsSold: number;
    revenue: number;
    occupancy: number;
  }>;
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/analytics?timeRange=${timeRange}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const data = await response.json();
        setAnalyticsData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Failed to load analytics'}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Revenue',
      value: `GHS ${analyticsData.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Ticket Sales',
      value: analyticsData.ticketsSold.toLocaleString(),
      change: '+23.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Active Users',
      value: analyticsData.activeUsers.toLocaleString(),
      change: '+18.2%',
      trend: 'up',
      icon: Users,
      color: 'indigo'
    },
    {
      title: 'Events Created',
      value: analyticsData.eventsCreated.toString(),
      change: '+15.3%',
      trend: 'up',
      icon: Calendar,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
              </div>
              <div className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="inline h-4 w-4 ml-1" />
                ) : (
                  <ArrowDownRight className="inline h-4 w-4 ml-1" />
                )}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
          <RevenueChart data={analyticsData.revenueData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ticket Sales</h2>
          <TicketSalesChart data={analyticsData.ticketSalesData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h2>
          <UserGrowthChart data={analyticsData.userGrowthData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h2>
          <CategoryDistributionChart data={analyticsData.categoryData} />
        </div>
      </div>

      {/* Top Events Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Events</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Event</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Tickets Sold</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Revenue</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Occupancy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analyticsData.topEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{event.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{event.ticketsSold}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">GHS {event.revenue}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full mr-2">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${event.occupancy}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{event.occupancy}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}