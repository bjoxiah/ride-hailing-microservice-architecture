import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from './kafka/kafka.module';
import { MetricsModule } from './metrics/metrics.module';
import { InvoiceModule } from './invoice/invoice.module';
import { UserSnapshotModule } from './user-snapshot/user-snapshot.module';

@Module({
  imports: [
    PaymentModule,
    KafkaModule,
    MetricsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres-payment-service',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME || 'postgresuser',
      password: process.env.DB_PASSWORD || 'postgrespwd',
      database: process.env.DB_NAME || 'paymentsdb',
      autoLoadEntities: true,
      synchronize: true, // turn off in production
    }),
    InvoiceModule,
    UserSnapshotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
