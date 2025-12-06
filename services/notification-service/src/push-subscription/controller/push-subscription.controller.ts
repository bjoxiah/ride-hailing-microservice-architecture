import { Controller, Post, Delete, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { PushSubscriptionService } from '../service/push-subscription.service';
import { SubscribeDto } from '../dto/subscribe.dto';
import { UnsubscribeDto } from '../dto/unsubscribe.dto';
import { TestDto } from '../dto/test.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('push-subscriptions')
@Controller('push-subscriptions')
export class PushSubscriptionController {
  constructor(
    private pushService: PushSubscriptionService,
    private configService: ConfigService,
  ) {}

  @Get('vapid-public-key')
  @ApiOperation({ summary: 'Get VAPID public key for browser subscription' })
  getVapidPublicKey() {
    const publicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');

    if (!publicKey) {
      return {
        error: 'VAPID public key not configured',
      };
    }

    return { publicKey };
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to push notifications' })
  @ApiBody({ type: SubscribeDto })
  async subscribe(@Body() body: SubscribeDto) {
    await this.pushService.subscribe(body.userId, body.subscription);
    return { success: true, message: 'Subscribed successfully' };
  }

  @Delete('unsubscribe')
  @ApiOperation({ summary: 'Unsubscribe from push notifications' })
  @ApiBody({ type: UnsubscribeDto })
  async unsubscribe(@Body() body: UnsubscribeDto) {
    await this.pushService.unsubscribe(body.userId, body.endpoint);
    return { success: true, message: 'Unsubscribed successfully' };
  }

  @Post('test')
  @ApiOperation({ summary: 'Send test notification' })
  @ApiBody({ type: TestDto })
  async sendTest(@Body() body: TestDto) {
    await this.pushService.sendNotification(body.userId, {
      title: 'Test Notification',
      body: 'This is a test push notification',
      icon: '/icon.png',
    });
    return { success: true };
  }
}
