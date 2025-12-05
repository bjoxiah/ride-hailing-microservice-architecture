import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer, IHeaders } from 'kafkajs';
// Import the OpenTelemetry API
import { trace, SpanKind, context } from '@opentelemetry/api';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  public producer: Producer;
  public consumer: Consumer;
  // Define an ActivitySource equivalent (called Tracer in OTel JS API)
  private readonly tracer = trace.getTracer('ride-service');

  async onModuleInit() {
    this.kafka = new Kafka({
      brokers: [process.env.KAFKA_BROKER || 'redpanda:9092'],
    });

    this.producer = this.kafka.producer();
    await this.producer.connect();
    this.consumer = this.kafka.consumer({ groupId: 'ride-service-group' });
    await this.consumer.connect();
  }

  async send(topic: string, message: any) {
    // 1. Start a new span for the 'produce' operation
    const span = this.tracer.startSpan(`kafka.produce -> ${topic}`, {
      kind: SpanKind.PRODUCER,
      attributes: {
        'messaging.system': 'kafka',
        'messaging.destination': topic,
      },
    });

    // 2. Get the current trace context
    const traceContext = context.active();
    // 3. Inject the trace context into the message headers using the OTel API
    const headers: IHeaders = {};

    // OTel provides a TextMap-style injector for different formats (W3C is default)
    trace.getSpanContext(traceContext);

    // Manual injection using the active span context ID if you want direct access
    const spanContext = span.spanContext();
    if (spanContext.traceId) {
      // This is where you get the W3C traceparent value
      const traceparent = `00-${spanContext.traceId}-${spanContext.spanId}-01`;
      headers['traceparent'] = Buffer.from(traceparent);
    }

    // 4. Send the message within the context of the span
    try {
      const result = await this.producer.send({
        topic,
        messages: [
          {
            key: crypto.randomUUID(),
            value: JSON.stringify(message),
            headers: headers, // Include the headers
          },
        ],
      });
      // 5. End the span
      span.end();
      return result;
    } catch (error) {
      // If an error occurs, record it on the span before ending
      span.recordException(error);
      span.end();
      throw error;
    }
  }
}
