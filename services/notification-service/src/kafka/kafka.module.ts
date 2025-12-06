import { Module } from '@nestjs/common';
import { KafkaService } from './service/kafka.service';
import { KafkaClientModule } from './kafka-client.module';

@Module({
  imports: [KafkaClientModule],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
