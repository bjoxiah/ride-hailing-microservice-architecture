import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { InvoiceService } from '../service/invoice.service';
import { KafkaService } from 'src/kafka/service/kafka.service';
import { EventType } from 'src/kafka/event/event-type';

@Controller()
export class InvoiceConsumer {
  private readonly logger = new Logger(InvoiceConsumer.name);
  constructor(
    private invoiceService: InvoiceService,
    private kafkaService: KafkaService,
  ) {}

  @EventPattern(EventType.RIDE_COMPLETED)
  async handleRideCompleted(
    @Payload() event: any,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(`=== Received ${context.getTopic()} event ===`);
    this.logger.log('Raw message:', JSON.stringify(event, null, 2));
    const { data } = event;

    const fare = await this.invoiceService.calculateFare(
      data.originCoordinates,
      data.destinationCoordinates,
    );

    const invoice = await this.invoiceService.create({
      rideRequestId: data.id,
      riderId: data.riderId,
      driverId: data.driverId,
      amount: fare,
      code: `INV-${crypto.randomUUID().split('-')[0].toUpperCase()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Emit an event that invoice has been created
    await this.kafkaService.emit(EventType.INVOICE_CREATED, invoice);
  }
}
