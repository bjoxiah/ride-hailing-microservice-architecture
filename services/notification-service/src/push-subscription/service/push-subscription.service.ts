import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PushNotificationSubscription } from '../entity/push-notification-subscription.entity';
import * as webpush from 'web-push';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PushSubscriptionService implements OnModuleInit {
  private readonly logger = new Logger(PushSubscriptionService.name);
  private isConfigured = false;

  constructor(
    @InjectRepository(PushNotificationSubscription)
    private subscriptionRepo: Repository<PushNotificationSubscription>,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    // Use ConfigService to get environment variables
    const publicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    const subject = this.configService.get<string>(
      'VAPID_SUBJECT',
      'mailto:no-reply@example.com',
    );

    this.logger.log(`Public Key: ${publicKey ? '✓ Set' : '✗ Missing'}`);
    this.logger.log(`Private Key: ${privateKey ? '✓ Set' : '✗ Missing'}`);

    if (!publicKey || !privateKey) {
      this.logger.error('❌ VAPID keys not configured!');
      this.logger.error('Run: npx web-push generate-vapid-keys');
      this.logger.error(
        'Then add VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to .env file',
      );
      this.isConfigured = false;
      return;
    }

    try {
      webpush.setVapidDetails(subject, publicKey, privateKey);
      this.isConfigured = true;
      this.logger.log('✓ Web Push configured successfully');
    } catch (error) {
      this.logger.error('Failed to configure web-push:', error);
      this.isConfigured = false;
    }
  }

  private checkConfiguration() {
    if (!this.isConfigured) {
      throw new Error('Web Push is not configured. Check VAPID keys.');
    }
  }

  async subscribe(userId: string, subscription: any) {
    this.checkConfiguration();
    const existing = await this.subscriptionRepo.findOne({
      where: {
        userId,
        endpoint: subscription.endpoint,
      },
    });

    if (existing) {
      existing.p256dh = subscription.keys.p256dh;
      existing.auth = subscription.keys.auth;
      existing.isActive = true;
      return this.subscriptionRepo.save(existing);
    }

    const newSub = this.subscriptionRepo.create({
      userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      deviceType: subscription.deviceType,
      isActive: true,
    });

    return this.subscriptionRepo.save(newSub);
  }

  async unsubscribe(userId: string, endpoint: string) {
    await this.subscriptionRepo.update(
      { userId, endpoint },
      { isActive: false },
    );
  }

  async getActiveSubscriptions(
    userId: string,
  ): Promise<PushNotificationSubscription[]> {
    return this.subscriptionRepo.find({
      where: { userId, isActive: true },
    });
  }

  async sendNotification(
    userId: string,
    payload: {
      title: string;
      body: string;
      icon?: string;
      badge?: string;
      data?: any;
    },
  ) {
    this.checkConfiguration();
    const subscriptions = await this.getActiveSubscriptions(userId);

    const notificationPayload = JSON.stringify(payload);

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          notificationPayload,
        );
        this.logger.log(`Push notification sent to user ${userId}`);
      } catch (error) {
        this.logger.error(`Failed to send push to ${sub.endpoint}:`, error);

        // If endpoint is no longer valid (410 or 404), deactivate it
        if (error.statusCode === 410 || error.statusCode === 404) {
          await this.subscriptionRepo.update(
            { id: sub.id },
            { isActive: false },
          );
        }
      }
    });

    await Promise.allSettled(sendPromises);
  }

  async broadcast(
    userIds: string[],
    payload: {
      title: string;
      body: string;
      icon?: string;
      data?: any;
    },
  ) {
    const promises = userIds.map((userId) =>
      this.sendNotification(userId, payload),
    );
    await Promise.allSettled(promises);
  }
}
