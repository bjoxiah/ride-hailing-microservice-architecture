import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { UserSnapshotService } from '../service/user-snapshot.service';
import { EventType } from 'src/kafka/event/event-type';

@Controller()
export class UserEventsConsumer {
  private readonly logger = new Logger(UserEventsConsumer.name);
  constructor(private userService: UserSnapshotService) {}

  @EventPattern(EventType.USER_CREATED)
  async handleUserCreated(@Payload() event: any, @Ctx() context: KafkaContext) {
    this.logger.log(`=== Received ${context.getTopic()} event ===`);
    this.logger.log('Raw message:', JSON.stringify(event, null, 2));
    const { data } = event;

    await this.userService.create({
      id: data.id,
      name: data.name,
      email: data.email,
      phoneNumber: data.phone_number,
      account: data.account,
      lastUpdatedAt: new Date(),
    });
  }

  @EventPattern(EventType.USER_UPDATED)
  async handleUserUpdated(@Payload() event: any, @Ctx() context: KafkaContext) {
    this.logger.log(`=== Received ${context.getTopic()} event ===`);
    this.logger.log('Raw message:', JSON.stringify(event, null, 2));
    const { data } = event;

    await this.userService.update(data.id, {
      name: data.fullName,
      email: data.email,
      phoneNumber: data.phone_number,
      account: data.account,
      lastUpdatedAt: new Date(),
    });
  }
}
