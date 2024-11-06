import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { NotificationType } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { FCMService } from './services/fcm.service';
import { NotificationTemplateService } from './services/template.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private websocketGateway: WebsocketGateway,
    private mailService: MailService,
    private fcmService: FCMService,
    private templateService: NotificationTemplateService,
    private loggingService: LoggingService
  ) {}

  async create(data: {
    userId: string;
    type: NotificationType;
    metadata?: any;
    sendEmail?: boolean;
    sendPush?: boolean;
  }) {
    try {
      // Get user's notification preferences
      const preferences = await this.prisma.notificationPreference.findUnique({
        where: { userId: data.userId }
      });

      // Check if user wants this type of notification
      if (preferences && !preferences.types.includes(data.type)) {
        return;
      }

      // Get notification template
      const template = this.templateService.getTemplate(data.type, data.metadata);

      // Create notification record
      const notification = await this.prisma.notification.create({
        data: {
          userId: data.userId,
          title: template.title,
          message: template.message,
          type: data.type,
          metadata: data.metadata
        }
      });

      // Send real-time notification
      this.websocketGateway.sendNotification(data.userId, notification);

      // Send email if enabled
      if (data.sendEmail && preferences?.email) {
        const user = await this.prisma.user.findUnique({
          where: { id: data.userId }
        });
        
        if (user?.email) {
          await this.mailService.sendNotificationEmail(
            user.email,
            template.title,
            template.message
          );
        }
      }

      // Send push notification if enabled
      if (data.sendPush && preferences?.push) {
        const tokens = await this.prisma.pushToken.findMany({
          where: { userId: data.userId }
        });

        if (tokens.length > 0) {
          await this.fcmService.sendMulticast(
            tokens.map(t => t.token),
            {
              title: template.title,
              body: template.message,
              data: data.metadata
            }
          );
        }
      }

      // Log notification
      this.loggingService.logAudit('notification_sent', data.userId, {
        notificationId: notification.id,
        type: data.type
      });

      return notification;
    } catch (error) {
      this.loggingService.logError(error);
      throw error;
    }
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.update({
      where: { id, userId },
      data: { read: true }
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });
  }

  async getUserNotifications(userId: string, query: {
    skip?: number;
    take?: number;
    type?: NotificationType;
    read?: boolean;
  }) {
    return this.prisma.notification.findMany({
      where: {
        userId,
        type: query.type,
        read: query.read
      },
      orderBy: { createdAt: 'desc' },
      skip: query.skip,
      take: query.take
    });
  }

  async updatePreferences(userId: string, preferences: {
    email?: boolean;
    push?: boolean;
    types?: NotificationType[];
  }) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        ...preferences
      }
    });
  }

  async savePushToken(userId: string, token: string, device?: string) {
    return this.prisma.pushToken.upsert({
      where: { token },
      update: { userId, device },
      create: { userId, token, device }
    });
  }

  async removePushToken(token: string) {
    await this.prisma.pushToken.delete({
      where: { token }
    });
  }
}