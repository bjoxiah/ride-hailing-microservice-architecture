import { Module } from '@nestjs/common';
import { PrometheusService } from './service/prometheus.service';
import { collectDefaultMetrics, Registry } from 'prom-client';
import { MetricsController } from './controller/metrics.controller';

@Module({
  providers: [
    {
      provide: Registry,
      useFactory: () => {
        const registry = new Registry();
        collectDefaultMetrics({ register: registry });
        return registry;
      },
    },
    PrometheusService,
  ],
  exports: [PrometheusService, Registry],
  controllers: [MetricsController],
})
export class MetricsModule {}
