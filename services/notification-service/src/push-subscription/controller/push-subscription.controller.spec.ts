import { Test, TestingModule } from '@nestjs/testing';
import { PushSubscriptionController } from './push-subscription.controller';

describe('PushSubscriptionController', () => {
  let controller: PushSubscriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PushSubscriptionController],
    }).compile();

    controller = module.get<PushSubscriptionController>(
      PushSubscriptionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
