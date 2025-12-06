import { Module } from '@nestjs/common';
import { PushSubscriptionModule } from 'src/push-subscription/push-subscription.module';
import { PaymentConsumer } from './consumer/payment.consumer';

@Module({
  imports: [PushSubscriptionModule],
  controllers: [PaymentConsumer],
})
export class PaymentModule {}
