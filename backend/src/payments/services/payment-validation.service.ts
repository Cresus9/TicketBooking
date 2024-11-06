import { Injectable } from '@nestjs/common';
import { PaymentMethod } from '../dto/payment.dto';

@Injectable()
export class PaymentValidationService {
  validatePaymentAmount(orderAmount: number, paymentAmount: number): boolean {
    return Math.abs(orderAmount - paymentAmount) < 0.01;
  }

  validatePaymentMethod(method: string): boolean {
    return Object.values(PaymentMethod).includes(method as PaymentMethod);
  }

  validateCardDetails(details: any): { valid: boolean; error?: string } {
    if (!details.cardNumber || !details.expiryMonth || !details.expiryYear || !details.cvv) {
      return { valid: false, error: 'Missing required card details' };
    }

    const now = new Date();
    const expiry = new Date(
      parseInt(details.expiryYear),
      parseInt(details.expiryMonth) - 1
    );

    if (expiry < now) {
      return { valid: false, error: 'Card has expired' };
    }

    if (!/^\d{3,4}$/.test(details.cvv)) {
      return { valid: false, error: 'Invalid CVV' };
    }

    return { valid: true };
  }

  validateMobileMoneyDetails(details: any): { valid: boolean; error?: string } {
    if (!details.provider || !details.phone) {
      return { valid: false, error: 'Missing required mobile money details' };
    }

    const validProviders = ['mtn', 'vodafone', 'airteltigo'];
    if (!validProviders.includes(details.provider.toLowerCase())) {
      return { valid: false, error: 'Invalid mobile money provider' };
    }

    // Basic phone number validation for Ghana
    const phoneRegex = /^(\+233|0)(20|23|24|26|27|28|50|54|55|59)\d{7}$/;
    if (!phoneRegex.test(details.phone)) {
      return { valid: false, error: 'Invalid phone number format' };
    }

    return { valid: true };
  }
}