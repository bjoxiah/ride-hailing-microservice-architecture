import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { RideRequestModule } from './ride-request/ride-request.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    KafkaModule,
    MetricsModule,
    RideRequestModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres-ride-service',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME || 'postgresuser',
      password: process.env.DB_PASSWORD || 'postgrespwd',
      database: process.env.DB_NAME || 'ridesdb',
      autoLoadEntities: true,
      synchronize: true, // turn off in production
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
