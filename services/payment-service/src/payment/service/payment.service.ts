import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../entity/payment.entity';
import { KafkaService } from 'src/kafka/service/kafka.service';
import { Repository } from 'typeorm';
import { EventType } from 'src/kafka/event/event-type';
import { InvoiceService } from 'src/invoice/service/invoice.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private kafka: KafkaService,
    private invoiceService: InvoiceService,
  ) {}

  async create(paymentData: Partial<Payment>): Promise<Payment> {
    const payment = this.paymentRepository.create(paymentData);
    const result = await this.paymentRepository.save(payment);

    // Update invoice status to PAID
    await this.invoiceService.update(payment.invoiceId, { status: 'PAID' });

    // Emit event to Kafka
    await this.kafka.send(EventType.PAYMENT_RECEIVED, result);

    return result;
  }
}
