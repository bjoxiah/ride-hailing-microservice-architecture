import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { otelSDK } from './otel/otel';
import { Partitioners } from 'kafkajs';

// ---- Start OpenTelemetry BEFORE NestJS ----
otelSDK.start();
console.log('[OTEL] OpenTelemetry SDK started.');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ---- Connect Kafka Microservice ----
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER],
        clientId: 'notification-service',
        retry: {
          initialRetryTime: 300,
          retries: 10,
          multiplier: 2,
          maxRetryTime: 30000,
        },
        connectionTimeout: 10000,
        requestTimeout: 30000,
      },
      consumer: {
        groupId: 'notification-service-group',
        allowAutoTopicCreation: true,
        sessionTimeout: 30000,
        rebalanceTimeout: 60000,
        heartbeatInterval: 3000,
        // Start from earliest messages if no offsets exist
        retry: {
          initialRetryTime: 300,
          retries: 10,
          multiplier: 2,
          maxRetryTime: 30000,
        },
      },
      run: {
        autoCommit: true,
        autoCommitInterval: 5000,
        autoCommitThreshold: 100,
      },
      producer: {
        allowAutoTopicCreation: true,
        createPartitioner: Partitioners.DefaultPartitioner,
      },
    },
  });

  // ---- Start all microservices together ----
  await app.startAllMicroservices();
  console.log('[KAFKA] Kafka microservice is listening.');

  // ---- Enable graceful shutdown ----
  app.enableShutdownHooks();

  // ---- Global validation ----
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // ---- Cors ----
  app.enableCors();

  // ---- Swagger ----
  const config = new DocumentBuilder()
    .setTitle('Notification Service API')
    .setDescription('API documentation for Notification Service')
    .setVersion('1.0')
    .build();

  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, config),
  );

  // ---- Start HTTP server ----
  const port = process.env.PORT ?? 1050;
  await app.listen(port);

  console.log(`[HTTP] Notification service running on port ${port}`);
  console.log(`[SWAGGER] Documentation available at /api/docs`);
}

// Bootstrap application
bootstrap().catch((err) => {
  console.error('[BOOTSTRAP ERROR]', err);
  process.exit(1);
});

// ---- OTEL Shutdown (Graceful) ----
process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down OpenTelemetry...');
  otelSDK.shutdown().then(() => process.exit(0));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down OpenTelemetry...');
  otelSDK.shutdown().then(() => process.exit(0));
});
