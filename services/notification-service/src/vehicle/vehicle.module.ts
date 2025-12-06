import { Module } from '@nestjs/common';
import { PushSubscriptionModule } from 'src/push-subscription/push-subscription.module';
import { VehicleConsumer } from './consumer/vehicle.consumer';

@Module({
  imports: [PushSubscriptionModule],
  controllers: [VehicleConsumer],
})
export class VehicleModule {}
