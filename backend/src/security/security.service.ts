import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SecurityService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async verifyRecaptcha(token: string): Promise<boolean> {
    try {
      const secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
      const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: secretKey,
            response: token,
          },
        },
      );
      return response.data.success;
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return false;
    }
  }

  async logSecurityEvent(data: {
    action: string;
    ip: string;
    userId?: string;
    details: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
  }) {
    return this.prisma.securityLog.create({
      data: {
        action: data.action,
        ip: data.ip,
        userId: data.userId,
        details: data.details,
        severity: data.severity,
      },
    });
  }

  async blockIP(ip: string, reason: string, duration: number) {
    const expiresAt = new Date(Date.now() + duration * 60 * 1000);
    return this.prisma.blockedIP.create({
      data: {
        ip,
        reason,
        expiresAt,
      },
    });
  }

  async isIPBlocked(ip: string): Promise<boolean> {
    const blockedIP = await this.prisma.blockedIP.findFirst({
      where: {
        ip,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    return !!blockedIP;
  }

  async getSecurityLogs(params: {
    skip?: number;
    take?: number;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH';
  }) {
    return this.prisma.securityLog.findMany({
      skip: params.skip,
      take: params.take,
      where: params.severity ? { severity: params.severity } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBlockedIPs() {
    return this.prisma.blockedIP.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}