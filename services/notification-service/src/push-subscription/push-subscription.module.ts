import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushSubscriptionController } from './controller/push-subscription.controller';
import { PushSubscriptionService } from './service/push-subscription.service';
import { PushNotificationSubscription } from './entity/push-notification-subscription.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([PushNotificationSubscription]),
  ],
  controllers: [PushSubscriptionController],
  providers: [PushSubscriptionService],
  exports: [PushSubscriptionService],
})
export class PushSubscriptionModule {}
