import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MonitoringService {
  constructor(
    @InjectMetric('http_request_duration_seconds')
    private readonly requestDuration: Histogram,
    @InjectMetric('http_requests_total')
    private readonly requestsTotal: Counter,
    @InjectMetric('active_users_total')
    private readonly activeUsers: Gauge,
    @InjectMetric('ticket_sales_total')
    private readonly ticketSales: Counter,
    @InjectMetric('event_capacity_usage')
    private readonly eventCapacity: Gauge
  ) {}

  recordRequestDuration(method: string, path: string, statusCode: number, duration: number) {
    this.requestDuration.observe(
      { method, path, status_code: statusCode },
      duration
    );
  }

  incrementRequestCount(method: string, path: string, statusCode: number) {
    this.requestsTotal.inc({ method, path, status_code: statusCode });
  }

  setActiveUsers(count: number) {
    this.activeUsers.set(count);
  }

  recordTicketSale(eventId: string, ticketType: string, quantity: number) {
    this.ticketSales.inc({ event_id: eventId, ticket_type: ticketType }, quantity);
  }

  updateEventCapacity(eventId: string, usedCapacity: number, totalCapacity: number) {
    const usage = (usedCapacity / totalCapacity) * 100;
    this.eventCapacity.set({ event_id: eventId }, usage);
  }
}