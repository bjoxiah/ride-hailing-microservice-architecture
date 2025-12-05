import { Module } from '@nestjs/common';
import { RideRequestController } from './controller/ride-request.controller';
import { RideRequestService } from './service/ride-request.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideRequest } from './entity/ride-request.entity';

@Module({
  imports: [KafkaModule, TypeOrmModule.forFeature([RideRequest])],
  controllers: [RideRequestController],
  providers: [RideRequestService],
})
export class RideRequestModule {}
