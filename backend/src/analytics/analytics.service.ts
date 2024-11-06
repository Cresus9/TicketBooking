import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalEvents,
      totalOrders,
      totalRevenue,
      recentOrders,
      topEvents,
      userGrowth,
      salesByCategory
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.event.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { total: true }
      }),
      this.getRecentOrders(),
      this.getTopEvents(),
      this.getUserGrowth(),
      this.getSalesByCategory()
    ]);

    return {
      totalUsers,
      totalEvents,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders,
      topEvents,
      userGrowth,
      salesByCategory
    };
  }

  private async getRecentOrders() {
    return this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        event: {
          select: {
            title: true
          }
        }
      }
    });
  }

  private async getTopEvents() {
    return this.prisma.event.findMany({
      take: 5,
      orderBy: { ticketsSold: 'desc' },
      select: {
        id: true,
        title: true,
        ticketsSold: true,
        capacity: true,
        _count: {
          select: { orders: true }
        }
      }
    });
  }

  private async getUserGrowth() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      _count: true,
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  private async getSalesByCategory() {
    const events = await this.prisma.event.findMany({
      select: {
        categories: true,
        orders: {
          where: { status: 'COMPLETED' },
          select: { total: true }
        }
      }
    });

    const categoryTotals = new Map<string, number>();
    events.forEach(event => {
      event.categories.forEach(category => {
        const currentTotal = categoryTotals.get(category) || 0;
        const eventTotal = event.orders.reduce((sum, order) => sum + order.total, 0);
        categoryTotals.set(category, currentTotal + eventTotal);
      });
    });

    return Array.from(categoryTotals.entries()).map(([category, total]) => ({
      category,
      total
    }));
  }

  async getEventAnalytics(eventId: string) {
    const [event, orders, tickets] = await Promise.all([
      this.prisma.event.findUnique({
        where: { id: eventId }
      }),
      this.prisma.order.findMany({
        where: {
          eventId,
          status: 'COMPLETED'
        }
      }),
      this.prisma.ticket.findMany({
        where: { eventId }
      })
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const ticketTypes = tickets.reduce((acc, ticket) => {
      acc[ticket.type] = (acc[ticket.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      event,
      totalRevenue,
      orderCount: orders.length,
      ticketsSold: tickets.length,
      ticketTypes,
      occupancyRate: event ? (tickets.length / event.capacity) * 100 : 0
    };
  }

  async getRevenueByPeriod(period: 'daily' | 'weekly' | 'monthly') {
    const groupBy = {
      daily: 'day',
      weekly: 'week',
      monthly: 'month'
    }[period];

    return this.prisma.$queryRaw`
      SELECT
        DATE_TRUNC(${groupBy}, "createdAt") as period,
        SUM(total) as revenue,
        COUNT(*) as orders
      FROM "Order"
      WHERE status = 'COMPLETED'
      GROUP BY period
      ORDER BY period ASC
    `;
  }
}