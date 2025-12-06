import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSnapshot } from '../entity/user-snapshot.entity';

@Injectable()
export class UserSnapshotService {
  constructor(
    @InjectRepository(UserSnapshot)
    private repo: Repository<UserSnapshot>,
  ) {}

  create(data: Partial<UserSnapshot>): Promise<UserSnapshot> {
    const snapshot = this.repo.create(data);
    return this.repo.save(snapshot);
  }

  async update(userId: string, data: Partial<UserSnapshot>): Promise<void> {
    await this.repo.update({ id: userId }, data);
  }

  getById(userId: string): Promise<UserSnapshot | null> {
    return this.repo.findOne({ where: { id: userId } });
  }
}
