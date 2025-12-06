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
export class VehicleConsumer {
  private readonly logger = new Logger(VehicleConsumer.name);
  constructor(private pushSubscriptionService: PushSubscriptionService) {}

  @EventPattern(EventType.VEHICLE_ASSIGNED)
  async handleRideCompleted(
    @Payload() event: any,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(`=== Received ${context.getTopic()} event ===`);
    this.logger.log('Raw message:', JSON.stringify(event, null, 2));
    const { data } = event;

    await this.pushSubscriptionService.sendNotification(data.rider_id, {
      title: 'Driver Assigned',
      body: `${data.driver.name} has been assigned to your ride.`,
      icon: '/icon.png',
    });
  }

  @EventPattern(EventType.VEHICLE_ARRIVED)
  async handleVehicleArrived(
    @Payload() event: any,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(`=== Received ${context.getTopic()} event ===`);
    this.logger.log('Raw message:', JSON.stringify(event, null, 2));
    const { data } = event;

    await this.pushSubscriptionService.sendNotification(data.riderId, {
      title: 'Driver Arrived',
      body: `${data.driver.name} has arrived at your pickup location.`,
      icon: '/icon.png',
    });
  }

  @EventPattern(EventType.VEHICLE_UNAVAILABLE)
  async handleVehicleUnavailable(
    @Payload() event: any,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(`=== Received ${context.getTopic()} event ===`);
    this.logger.log('Raw message:', JSON.stringify(event, null, 2));
    const { data } = event;

    await this.pushSubscriptionService.sendNotification(data.rider_id, {
      title: 'Vehicle Unavailable',
      body: `The vehicle available at the moment, try again later.`,
      icon: '/icon.png',
    });
  }

  @EventPattern(EventType.VEHICLE_CREATED)
  async handleVehicleCreated(
    @Payload() event: any,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(`=== Received ${context.getTopic()} event ===`);
    this.logger.log('Raw message:', JSON.stringify(event, null, 2));
    const { data } = event;

    await this.pushSubscriptionService.sendNotification(data.id, {
      title: 'New Vehicle Created',
      body: `${data.name}'s vehicle information has been added to the system.`,
      icon: '/icon.png',
    });
  }

  @EventPattern(EventType.VEHICLE_UPDATED)
  async handleVehicleUpdated(
    @Payload() event: any,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(`=== Received ${context.getTopic()} event ===`);
    this.logger.log('Raw message:', JSON.stringify(event, null, 2));
    const { data } = event;

    await this.pushSubscriptionService.sendNotification(data.id, {
      title: 'Vehicle Vehicle Updated',
      body: `${data.name}'s vehicle information has been updated on the system.`,
      icon: '/icon.png',
    });
  }
}
