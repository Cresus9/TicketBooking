import { mockAnalyticsService } from './mockData';

export interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalRevenue: number;
  ticketsSold: number;
  recentOrders: any[];
  userGrowth: any[];
  salesByCategory: any[];
}

export const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      // Use mock service instead of API for now
      return await mockAnalyticsService.getDashboardStats();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};