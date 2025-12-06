import { Module } from '@nestjs/common';
import { InvoiceService } from './service/invoice.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entity/invoice.entity';
import { InvoiceConsumer } from './consumer/invoice.consumer';

@Module({
  imports: [KafkaModule, TypeOrmModule.forFeature([Invoice])],
  providers: [InvoiceService],
  controllers: [InvoiceConsumer],
  exports: [InvoiceService],
})
export class InvoiceModule {}
