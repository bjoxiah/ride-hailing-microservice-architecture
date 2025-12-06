import { Test, TestingModule } from '@nestjs/testing';
import { UserSnapshotService } from './user-snapshot.service';

describe('UserSnapshotService', () => {
  let service: UserSnapshotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSnapshotService],
    }).compile();

    service = module.get<UserSnapshotService>(UserSnapshotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
