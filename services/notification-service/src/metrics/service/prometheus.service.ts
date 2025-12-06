import { Injectable } from '@nestjs/common';
import { Registry } from 'prom-client';

@Injectable()
export class PrometheusService {
  constructor(private registry: Registry) {}

  getMetrics() {
    return this.registry.metrics();
  }
}
