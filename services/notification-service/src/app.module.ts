import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { PushSubscriptionModule } from './push-subscription/push-subscription.module';
import { UserSnapshotModule } from './user-snapshot/user-snapshot.module';
import { RideModule } from './ride/ride.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { PaymentModule } from './payment/payment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsModule } from './metrics/metrics.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    KafkaModule,
    UserSnapshotModule,
    PushSubscriptionModule,
    RideModule,
    VehicleModule,
    PaymentModule,
    MetricsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // turn off in production
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
