import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../../notifications/notifications.service';
import { PaymentMethod } from '../dto/payment.dto';

@Injectable()
export class PaymentNotificationService {
  constructor(private notificationsService: NotificationsService) {}

  async sendPaymentSuccessNotification(userId: string, data: {
    orderId: string;
    amount: number;
    currency: string;
    method: PaymentMethod;
    transactionId: string;
  }) {
    await this.notificationsService.create({
      userId,
      type: 'PAYMENT_SUCCESS',
      title: 'Payment Successful',
      message: `Your payment of ${data.currency} ${data.amount} has been processed successfully.`,
      metadata: {
        orderId: data.orderId,
        transactionId: data.transactionId,
        method: data.method
      }
    });
  }

  async sendPaymentFailureNotification(userId: string, data: {
    orderId: string;
    amount: number;
    currency: string;
    method: PaymentMethod;
    error: string;
  }) {
    await this.notificationsService.create({
      userId,
      type: 'PAYMENT_FAILED',
      title: 'Payment Failed',
      message: `Your payment of ${data.currency} ${data.amount} could not be processed. ${data.error}`,
      metadata: {
        orderId: data.orderId,
        method: data.method,
        error: data.error
      }
    });
  }

  async sendPaymentPendingNotification(userId: string, data: {
    orderId: string;
    amount: number;
    currency: string;
    method: PaymentMethod;
  }) {
    await this.notificationsService.create({
      userId,
      type: 'PAYMENT_PENDING',
      title: 'Payment Processing',
      message: `Your payment of ${data.currency} ${data.amount} is being processed.`,
      metadata: {
        orderId: data.orderId,
        method: data.method
      }
    });
  }
}