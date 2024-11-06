import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private diskHealth: DiskHealthIndicator,
    private memoryHealth: MemoryHealthIndicator,
    private prisma: PrismaService
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check application health' })
  check() {
    return this.health.check([
      // Database health check
      () => this.prismaHealth.pingCheck('database', this.prisma),
      
      // Disk space check
      () =>
        this.diskHealth.checkStorage('storage', {
          thresholdPercent: 0.9,
          path: '/',
        }),
      
      // Memory usage check
      () =>
        this.memoryHealth.checkHeap('memory_heap', 200 * 1024 * 1024), // 200MB
      () =>
        this.memoryHealth.checkRSS('memory_rss', 3000 * 1024 * 1024), // 3GB
    ]);
  }
}