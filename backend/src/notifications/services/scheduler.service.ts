import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationSchedulerService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledNotifications() {
    const now = new Date();
    const scheduledNotifications = await this.prisma.scheduledNotification.findMany({
      where: {
        scheduledFor: {
          lte: now
        },
        sent: false
      }
    });

    for (const notification of scheduledNotifications) {
      try {
        await this.notificationsService.create({
          title: notification.title,
          message: notification.message,
          type: notification.type,
          userId: notification.userId,
          metadata: notification.metadata,
          sendEmail: notification.sendEmail,
          sendPush: notification.sendPush
        });

        await this.prisma.scheduledNotification.update({
          where: { id: notification.id },
          data: { sent: true }
        });
      } catch (error) {
        console.error(`Failed to send scheduled notification ${notification.id}:`, error);
      }
    }
  }

  async scheduleNotification(data: {
    scheduledFor: Date;
    title: string;
    message: string;
    type: string;
    userId: string;
    metadata?: any;
    sendEmail?: boolean;
    sendPush?: boolean;
  }) {
    return this.prisma.scheduledNotification.create({
      data: {
        ...data,
        sent: false
      }
    });
  }

  async cancelScheduledNotification(id: string): Promise<void> {
    await this.prisma.scheduledNotification.delete({
      where: { id }
    });
  }
}