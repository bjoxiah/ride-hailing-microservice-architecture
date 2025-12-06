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
export class RideConsumer {
  private readonly logger = new Logger(RideConsumer.name);
  constructor(private pushSubscriptionService: PushSubscriptionService) {}

  @EventPattern(EventType.RIDE_COMPLETED)
  async handleRideCompleted(
    @Payload() event: any,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(`=== Received ${context.getTopic()} event ===`);
    this.logger.log('Raw message:', JSON.stringify(event, null, 2));
    const { data } = event;

    await this.pushSubscriptionService.sendNotification(data.rider_id, {
      title: 'Ride Completed',
      body: `Your ride from ${data.origin_name} to ${data.destination_name} has been completed.`,
      icon: '/icon.png',
    });
  }

  @EventPattern(EventType.RIDE_CANCELED)
  async handleRideCanceled(
    @Payload() event: any,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(`=== Received ${context.getTopic()} event ===`);
    this.logger.log('Raw message:', JSON.stringify(event, null, 2));
    const { data } = event;

    await this.pushSubscriptionService.sendNotification(data.rider_id, {
      title: 'Ride Canceled',
      body: `Your ride from ${data.origin_name} to ${data.destination_name} has been canceled.`,
      icon: '/icon.png',
    });
  }

  @EventPattern(EventType.RIDE_STARTED)
  async handleRideStarted(@Payload() event: any, @Ctx() context: KafkaContext) {
    this.logger.log(`=== Received ${context.getTopic()} event ===`);
    this.logger.log('Raw message:', JSON.stringify(event, null, 2));
    const { data } = event;

    await this.pushSubscriptionService.sendNotification(data.rider_id, {
      title: 'Ride Started',
      body: `Your ride from ${data.origin_name} to ${data.destination_name} has started.`,
      icon: '/icon.png',
    });
  }

  @EventPattern(EventType.RIDE_CREATED)
  async handleRideCreated(@Payload() event: any, @Ctx() context: KafkaContext) {
    this.logger.log(`=== Received ${context.getTopic()} event ===`);
    this.logger.log('Raw message:', JSON.stringify(event, null, 2));
    const { data } = event;

    await this.pushSubscriptionService.sendNotification(data.riderId, {
      title: 'Ride Created',
      body: `Your ride from ${data.origin_name} to ${data.destination_name} has been created.`,
      icon: '/icon.png',
    });
  }
}
