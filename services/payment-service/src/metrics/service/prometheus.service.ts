import { Injectable } from '@nestjs/common';
import { Registry, Counter } from 'prom-client';

@Injectable()
export class PrometheusService {
  public rideCreated: Counter;

  constructor(private registry: Registry) {
    this.rideCreated = new Counter({
      name: 'rides_created_total',
      help: 'Total number of rides created',
      registers: [this.registry],
    });
  }

  getMetrics() {
    return this.registry.metrics();
  }
}
