import {
  Injectable,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { trace, SpanKind, context, propagation } from '@opentelemetry/api';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private readonly tracer = trace.getTracer('payment-service');

  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // Connect the Kafka client
    await this.kafkaClient.connect();
    this.logger.log('Kafka producer client connected');
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
    this.logger.log('Kafka producer client closed');
  }

  /**
   * Send a message to a Kafka topic (fire-and-forget)
   * @param topic - The Kafka topic
   * @param message - The message payload
   */
  async emit(topic: string, message: any): Promise<void> {
    const span = this.tracer.startSpan(`kafka.produce: ${topic}`, {
      kind: SpanKind.PRODUCER,
      attributes: {
        'messaging.system': 'kafka',
        'messaging.destination': topic,
        'messaging.operation': 'publish',
      },
    });

    try {
      // Inject trace context into message headers
      const headers: Record<string, any> = {};
      propagation.inject(context.active(), headers);

      // Emit message (fire-and-forget)
      this.kafkaClient.emit(topic, {
        key: crypto.randomUUID(),
        value: message,
        headers,
      });

      this.logger.log(`Message emitted to topic: ${topic}`);
      span.setStatus({ code: 1 }); // OK
    } catch (err) {
      this.logger.error(`Failed to emit message to topic ${topic}:`, err);
      span.recordException(err);
      span.setStatus({ code: 2, message: err.message }); // ERROR
      throw err;
    } finally {
      span.end();
    }
  }

  /**
   * Send a message and wait for response (request-response pattern)
   * @param topic - The Kafka topic
   * @param message - The message payload
   * @returns Observable that resolves to the response
   */
  async send(topic: string, message: any): Promise<any> {
    const span = this.tracer.startSpan(`kafka.send: ${topic}`, {
      kind: SpanKind.PRODUCER,
      attributes: {
        'messaging.system': 'kafka',
        'messaging.destination': topic,
        'messaging.operation': 'send',
      },
    });

    try {
      // Inject trace context
      const headers: Record<string, any> = {};
      propagation.inject(context.active(), headers);

      // Send and wait for response
      const response = await lastValueFrom(
        this.kafkaClient.send(topic, {
          key: crypto.randomUUID(),
          value: message,
          headers,
        }),
      );

      this.logger.log(`Message sent to topic: ${topic}, received response`);
      span.setStatus({ code: 1 });
      return response;
    } catch (err) {
      this.logger.error(`Failed to send message to topic ${topic}:`, err);
      span.recordException(err);
      span.setStatus({ code: 2, message: err.message });
      throw err;
    } finally {
      span.end();
    }
  }
}
