import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FCMService {
  constructor(private configService: ConfigService) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.configService.get('FIREBASE_PROJECT_ID'),
          clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
          privateKey: this.configService.get('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
        }),
      });
    }
  }

  async sendPushNotification(token: string, notification: {
    title: string;
    body: string;
    data?: Record<string, string>;
  }): Promise<void> {
    try {
      await admin.messaging().send({
        token,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            clickAction: 'FLUTTER_NOTIFICATION_CLICK',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered') {
        throw new Error('INVALID_TOKEN');
      }
      throw error;
    }
  }

  async sendMulticast(tokens: string[], notification: {
    title: string;
    body: string;
    data?: Record<string, string>;
  }): Promise<void> {
    if (!tokens.length) return;

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data,
      tokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    
    // Handle failed tokens
    if (response.failureCount > 0) {
      const failedTokens = response.responses
        .map((resp, idx) => resp.success ? null : tokens[idx])
        .filter(Boolean);
      
      // Remove invalid tokens
      await this.removeInvalidTokens(failedTokens);
    }
  }

  private async removeInvalidTokens(tokens: string[]): Promise<void> {
    // Implementation in NotificationsService
  }
}