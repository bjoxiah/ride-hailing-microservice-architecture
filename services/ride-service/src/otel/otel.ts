// src/instrumentation.ts

import { NodeSDK } from '@opentelemetry/sdk-node';
import * as Resource from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME as SEMRESATTRS_SERVICE_NAME,
  ATTR_SERVICE_VERSION as SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
// 👇 Change the import path to use the gRPC exporter 👇
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';

// Import necessary instrumentations as before
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { KafkaJsInstrumentation } from '@opentelemetry/instrumentation-kafkajs';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';

const traceExporter = new OTLPTraceExporter({
  // 👇 Use the standard gRPC port (default is 4317) 👇
  url:
    process.env.OTEL_EXPORTER_OTLP_GRPC_ENDPOINT ??
    'http://otel-collector:4317',
});

export const otelSDK = new NodeSDK({
  resource: Resource.resourceFromAttributes({
    [SEMRESATTRS_SERVICE_NAME]: process.env.SERVICE_NAME ?? 'ride-service',
    [SEMRESATTRS_SERVICE_VERSION]: process.env.SERVICE_VERSION ?? '1.0.0',
  }),
  traceExporter,
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new KafkaJsInstrumentation(),
    new PgInstrumentation(),
  ],
});
