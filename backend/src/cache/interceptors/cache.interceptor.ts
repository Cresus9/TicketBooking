import { Injectable, CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    const { httpAdapter } = this.httpAdapterHost;

    // Don't cache if user is authenticated
    if (request.user) {
      return undefined;
    }

    // Don't cache non-GET requests
    if (request.method !== 'GET') {
      return undefined;
    }

    // Generate cache key based on URL and query params
    const baseUrl = httpAdapter.getRequestUrl(request);
    const queryString = JSON.stringify(request.query);
    return `${baseUrl}:${queryString}`;
  }
}