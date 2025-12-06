import { Module } from '@nestjs/common';
import { PushSubscriptionModule } from 'src/push-subscription/push-subscription.module';
import { RideConsumer } from './consumer/ride.consumer';

@Module({
  imports: [PushSubscriptionModule],
  controllers: [RideConsumer],
})
export class RideModule {}
