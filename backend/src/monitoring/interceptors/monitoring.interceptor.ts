import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MonitoringService } from '../monitoring.service';
import { LoggingService } from '../../logging/logging.service';

@Injectable()
export class MonitoringInterceptor implements NestInterceptor {
  constructor(
    private readonly monitoringService: MonitoringService,
    private readonly loggingService: LoggingService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = context.switchToHttp().getResponse().statusCode;

          // Record metrics
          this.monitoringService.recordRequestDuration(
            method,
            url,
            statusCode,
            duration / 1000 // Convert to seconds
          );
          this.monitoringService.incrementRequestCount(method, url, statusCode);

          // Log request
          this.loggingService.logRequest(request, duration);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          // Record error metrics
          this.monitoringService.recordRequestDuration(
            method,
            url,
            statusCode,
            duration / 1000
          );
          this.monitoringService.incrementRequestCount(method, url, statusCode);

          // Log error
          this.loggingService.logError(error, request);
        },
      })
    );
  }
}