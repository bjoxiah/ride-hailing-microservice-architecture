import { Module } from '@nestjs/common';
import { KafkaService } from './service/kafka.service';

@Module({
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
