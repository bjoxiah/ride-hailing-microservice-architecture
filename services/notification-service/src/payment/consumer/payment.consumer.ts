import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { EventType } from 'src/kafka/event/event-type';
import { PushSubscriptionService } from 'src/push-subscription/service/push-subscription.service';

@Controller()
export class PaymentConsumer {
  private readonly logger = new Logger(PaymentConsumer.name);
  constructor(private pushSubscriptionService: PushSubscriptionService) {}

  @EventPattern(EventType.PAYMENT_RECEIVED)
  async handlePaymentReceived(
    @Payload() event: any,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(`=== Received ${context.getTopic()} event ===`);
    this.logger.log('Raw message:', JSON.stringify(event, null, 2));
    const { data } = event;

    await this.pushSubscriptionService.sendNotification(data.rider_id, {
      title: 'Payment Received',
      body: `Your payment of $${data.amount} for ride ${data.ride_id} has been received successfully.`,
      icon: '/icon.png',
    });
  }

  @EventPattern(EventType.INVOICE_CREATED)
  async handleInvoiceCreated(
    @Payload() event: any,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(`=== Received ${context.getTopic()} event ===`);
    this.logger.log('Raw message:', JSON.stringify(event, null, 2));
    const { data } = event;

    await this.pushSubscriptionService.sendNotification(data.rider_id, {
      title: 'Invoice Created',
      body: `An invoice of $${data.amount} has been created for your ride.`,
      icon: '/icon.png',
    });
  }
}
