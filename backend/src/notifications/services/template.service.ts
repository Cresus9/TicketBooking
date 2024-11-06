import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationTemplateService {
  private templates: Map<string, (data: any) => { title: string; message: string }>;

  constructor(private prisma: PrismaService) {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    this.templates = new Map([
      ['EVENT_REMINDER', (data) => ({
        title: 'Event Reminder',
        message: `Don't forget! ${data.eventName} starts in ${data.timeUntil}. Get ready for an amazing experience!`
      })],
      ['TICKET_PURCHASED', (data) => ({
        title: 'Ticket Purchase Confirmed',
        message: `Your tickets for ${data.eventName} have been confirmed. Check your email for details.`
      })],
      ['PRICE_CHANGE', (data) => ({
        title: 'Price Update',
        message: `Ticket prices for ${data.eventName} have changed. Book now to secure your spot!`
      })],
      ['EVENT_CANCELLED', (data) => ({
        title: 'Event Cancelled',
        message: `Unfortunately, ${data.eventName} has been cancelled. Your refund will be processed shortly.`
      })],
      ['EVENT_UPDATED', (data) => ({
        title: 'Event Details Updated',
        message: `There have been updates to ${data.eventName}. Check the event page for details.`
      })]
    ]);
  }

  getTemplate(type: string, data: any): { title: string; message: string } {
    const template = this.templates.get(type);
    if (!template) {
      throw new Error(`Template not found for type: ${type}`);
    }
    return template(data);
  }

  async createCustomTemplate(type: string, title: string, message: string): Promise<void> {
    this.templates.set(type, () => ({ title, message }));
  }
}