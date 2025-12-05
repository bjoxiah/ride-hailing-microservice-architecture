// src/main.ts (The working version)

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { otelSDK } from './otel/otel';

// 1. Call start() synchronously at the top level
otelSDK.start();
console.log('OpenTelemetry SDK started.');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable NestJS shutdown hooks
  app.enableShutdownHooks();

  // Use the global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // --- Swagger Configuration ---
  const config = new DocumentBuilder()
    .setTitle('Ride Service API')
    .setDescription('API documentation for the NestJS Ride Service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  // -----------------------------

  await app.listen(process.env.PORT ?? 4040);
  console.log(`Service is running on port ${process.env.PORT ?? 4040}`);
}

// 2. Call bootstrap immediately after start() returns
bootstrap().catch((err) => {
  console.error('Error bootstrapping application:', err);
  process.exit(1); // Exit if NestJS fails to start
});

// 3. Add specific handlers to manage the OTel SDK shutdown sequence
// Shutdown is asynchronous, so we use .then() here
process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down OTel SDK.');
  otelSDK.shutdown().then(() => process.exit(0));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down OTel SDK.');
  otelSDK.shutdown().then(() => process.exit(0));
});
