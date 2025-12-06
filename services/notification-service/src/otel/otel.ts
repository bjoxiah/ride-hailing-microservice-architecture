import { NodeSDK } from '@opentelemetry/sdk-node';
import * as Resource from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME as SEMRESATTRS_SERVICE_NAME,
  ATTR_SERVICE_VERSION as SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { KafkaJsInstrumentation } from '@opentelemetry/instrumentation-kafkajs';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_GRPC_ENDPOINT,
});

export const otelSDK = new NodeSDK({
  resource: Resource.resourceFromAttributes({
    [SEMRESATTRS_SERVICE_NAME]: process.env.SERVICE_NAME,
    [SEMRESATTRS_SERVICE_VERSION]: process.env.SERVICE_VERSION,
  }),
  traceExporter,
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new KafkaJsInstrumentation(),
    new PgInstrumentation(),
  ],
});
