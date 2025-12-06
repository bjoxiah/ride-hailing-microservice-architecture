import { Module } from '@nestjs/common';
import { UserSnapshotService } from './service/user-snapshot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSnapshot } from './entity/user-snapshot.entity';
import { UserEventsConsumer } from './consumer/user.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([UserSnapshot])],
  providers: [UserSnapshotService],
  controllers: [UserEventsConsumer],
  exports: [],
})
export class UserSnapshotModule {}
