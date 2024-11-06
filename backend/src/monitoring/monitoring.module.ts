import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MetricsController } from './metrics.controller';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrometheusModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        path: '/metrics',
        defaultMetrics: {
          enabled: true,
        },
        defaultLabels: {
          app: 'afritix',
          env: config.get('NODE_ENV'),
        },
      }),
    }),
  ],
  controllers: [MetricsController],
  providers: [MonitoringService],
  exports: [MonitoringService],
})
export class MonitoringModule {}