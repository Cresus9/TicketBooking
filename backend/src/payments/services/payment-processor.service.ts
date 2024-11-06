import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentMethod } from '../dto/payment.dto';

@Injectable()
export class PaymentProcessorService {
  constructor(private configService: ConfigService) {}

  async processCardPayment(data: {
    amount: number;
    currency: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  }) {
    // Mock card payment processing
    await this.simulateProcessingDelay();

    // Validate card details
    if (!this.validateCardNumber(data.cardNumber)) {
      return {
        success: false,
        error: 'Invalid card number'
      };
    }

    return {
      success: true,
      transactionId: `CARD-${Date.now()}`,
      details: {
        last4: data.cardNumber.slice(-4),
        brand: this.detectCardBrand(data.cardNumber),
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear
      }
    };
  }

  async processMobileMoneyPayment(data: {
    amount: number;
    currency: string;
    provider: string;
    phone: string;
  }) {
    // Mock mobile money payment processing
    await this.simulateProcessingDelay();

    // Validate phone number
    if (!this.validatePhoneNumber(data.phone)) {
      return {
        success: false,
        error: 'Invalid phone number'
      };
    }

    return {
      success: true,
      transactionId: `MOMO-${Date.now()}`,
      details: {
        provider: data.provider,
        phone: data.phone
      }
    };
  }

  private validateCardNumber(cardNumber: string): boolean {
    // Implement Luhn algorithm for card validation
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  private validatePhoneNumber(phone: string): boolean {
    // Basic phone number validation for Ghana
    const phoneRegex = /^(\+233|0)(20|23|24|26|27|28|50|54|55|59)\d{7}$/;
    return phoneRegex.test(phone);
  }

  private detectCardBrand(cardNumber: string): string {
    // Basic card brand detection
    if (/^4/.test(cardNumber)) return 'visa';
    if (/^5[1-5]/.test(cardNumber)) return 'mastercard';
    if (/^3[47]/.test(cardNumber)) return 'amex';
    return 'unknown';
  }

  private async simulateProcessingDelay(): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}