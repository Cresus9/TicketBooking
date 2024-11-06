import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private ordersService: OrdersService,
  ) {}

  async processPayment(orderId: string, paymentData: {
    method: string;
    amount: number;
    currency: string;
    details: any;
  }) {
    try {
      // Start transaction
      const result = await this.prisma.$transaction(async (prisma) => {
        // Get order
        const order = await this.ordersService.findOne(orderId);
        
        // Verify amount matches
        if (order.total !== paymentData.amount) {
          throw new Error('Payment amount mismatch');
        }

        // Process payment based on method
        const paymentResult = await this.processPaymentByMethod(
          paymentData.method,
          paymentData
        );

        if (!paymentResult.success) {
          throw new Error(paymentResult.error || 'Payment failed');
        }

        // Update order status
        await this.ordersService.update(orderId, {
          status: 'COMPLETED',
          paymentDetails: paymentResult.details
        });

        // Create payment record
        const payment = await prisma.payment.create({
          data: {
            orderId,
            amount: paymentData.amount,
            currency: paymentData.currency,
            method: paymentData.method,
            status: 'SUCCESS',
            transactionId: paymentResult.transactionId,
            details: paymentResult.details
          }
        });

        // Send notification
        await this.notificationsService.create({
          userId: order.userId,
          type: 'PAYMENT_SUCCESS',
          title: 'Payment Successful',
          message: `Your payment of ${paymentData.currency} ${paymentData.amount} has been processed successfully.`,
          metadata: {
            orderId,
            paymentId: payment.id
          }
        });

        return { success: true, payment };
      });

      return result;
    } catch (error) {
      // Send failure notification
      const order = await this.ordersService.findOne(orderId);
      await this.notificationsService.create({
        userId: order.userId,
        type: 'PAYMENT_FAILED',
        title: 'Payment Failed',
        message: 'Your payment could not be processed. Please try again.',
        metadata: { orderId }
      });

      throw error;
    }
  }

  private async processPaymentByMethod(method: string, data: any) {
    // Implement different payment methods here
    switch (method.toLowerCase()) {
      case 'card':
        return this.processCardPayment(data);
      case 'mobile_money':
        return this.processMobileMoneyPayment(data);
      default:
        throw new Error('Unsupported payment method');
    }
  }

  private async processCardPayment(data: any) {
    // Implement card payment processing
    // This is a mock implementation
    return {
      success: true,
      transactionId: `CARD-${Date.now()}`,
      details: {
        last4: data.details.last4,
        brand: data.details.brand
      }
    };
  }

  private async processMobileMoneyPayment(data: any) {
    // Implement mobile money payment processing
    // This is a mock implementation
    return {
      success: true,
      transactionId: `MOMO-${Date.now()}`,
      details: {
        provider: data.details.provider,
        phone: data.details.phone
      }
    };
  }
}