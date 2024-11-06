import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggingService } from '../../logging/logging.service';
import { MonitoringService } from '../monitoring.service';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(
    private readonly loggingService: LoggingService,
    private readonly monitoringService: MonitoringService
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Log error
    this.loggingService.logError(exception, request);

    // Record error metrics
    this.monitoringService.incrementRequestCount(
      request.method,
      request.url,
      status
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
      ...(process.env.NODE_ENV !== 'production' && {
        stack: exception.stack,
      }),
    });
  }
}