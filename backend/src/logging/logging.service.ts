import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Request } from 'express';

@Injectable()
export class LoggingService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  logRequest(req: Request, responseTime?: number) {
    const logData = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: (req as any).user?.id,
      responseTime,
      timestamp: new Date().toISOString(),
    };

    this.logger.info('HTTP Request', logData);
  }

  logError(error: Error, req?: Request) {
    const logData = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      request: req ? {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: (req as any).user?.id,
      } : undefined,
      timestamp: new Date().toISOString(),
    };

    this.logger.error('Application Error', logData);
  }

  logMetric(name: string, value: number, tags: Record<string, string> = {}) {
    const logData = {
      metric: name,
      value,
      tags,
      timestamp: new Date().toISOString(),
    };

    this.logger.info('Metric', logData);
  }

  logAudit(action: string, userId: string, details: any) {
    const logData = {
      action,
      userId,
      details,
      timestamp: new Date().toISOString(),
    };

    this.logger.info('Audit', logData);
  }

  logPerformance(operation: string, duration: number, metadata: any = {}) {
    const logData = {
      operation,
      duration,
      ...metadata,
      timestamp: new Date().toISOString(),
    };

    this.logger.info('Performance', logData);
  }
}