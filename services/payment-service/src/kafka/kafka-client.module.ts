import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'payment-service',
            brokers: [process.env.KAFKA_BROKER || 'redpanda:9092'],
            retry: {
              initialRetryTime: 300,
              retries: 10,
              multiplier: 2,
              maxRetryTime: 30000,
            },
            connectionTimeout: 10000,
            requestTimeout: 30000,
          },
          producer: {
            allowAutoTopicCreation: true,
            createPartitioner: Partitioners.DefaultPartitioner,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaClientModule {}
