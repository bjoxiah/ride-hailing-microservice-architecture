import { Module } from '@nestjs/common';
import { PaymentService } from './service/payment.service';
import { PaymentController } from './controller/payment.controller';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';

@Module({
  imports: [InvoiceModule, KafkaModule, TypeOrmModule.forFeature([Payment])],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
