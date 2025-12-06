import { Controller, Get } from '@nestjs/common';
import { PrometheusService } from '../service/prometheus.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metrics: PrometheusService) {}

  @Get()
  async getMetrics() {
    return this.metrics.getMetrics();
  }
}
