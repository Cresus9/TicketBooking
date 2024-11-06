import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationPreferenceService {
  constructor(private prisma: PrismaService) {}

  async getUserPreferences(userId: string) {
    return this.prisma.notificationPreference.findUnique({
      where: { userId }
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

  async shouldSendNotification(userId: string, type: NotificationType): Promise<{
    email: boolean;
    push: boolean;
  }> {
    const preferences = await this.getUserPreferences(userId);
    
    if (!preferences) {
      return { email: true, push: true }; // Default to all enabled if no preferences set
    }

    return {
      email: preferences.email && preferences.types.includes(type),
      push: preferences.push && preferences.types.includes(type)
    };
  }
}