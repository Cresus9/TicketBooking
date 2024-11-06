import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentMethod } from '../dto/payment.dto';

@Injectable()
export class PaymentLoggingService {
  constructor(private prisma: PrismaService) {}

  async logPaymentAttempt(data: {
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    method: PaymentMethod;
    status: 'INITIATED' | 'SUCCESS' | 'FAILED';
    error?: string;
    transactionId?: string;
    details?: any;
  }) {
    return this.prisma.paymentLog.create({
      data: {
        orderId: data.orderId,
        userId: data.userId,
        amount: data.amount,
        currency: data.currency,
        method: data.method,
        status: data.status,
        error: data.error,
        transactionId: data.transactionId,
        details: data.details
      }
    });
  }

  async getPaymentHistory(userId: string) {
    return this.prisma.paymentLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          include: {
            event: true
          }
        }
      }
    });
  }

  async getPaymentStats(period: 'daily' | 'weekly' | 'monthly') {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case 'daily':
        startDate.setDate(now.getDate() - 30); // Last 30 days
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - 90); // Last 90 days
        break;
      case 'monthly':
        startDate.setFullYear(now.getFullYear() - 1); // Last 12 months
        break;
    }

    return this.prisma.paymentLog.groupBy({
      by: ['status', 'method'],
      where: {
        createdAt: {
          gte: startDate,
          lte: now
        }
      },
      _count: true,
      _sum: {
        amount: true
      }
    });
  }
}