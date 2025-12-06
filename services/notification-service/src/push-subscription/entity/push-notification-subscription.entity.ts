import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PushNotificationSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('text')
  endpoint: string;

  @Column('text')
  p256dh: string; // Encryption key

  @Column('text')
  auth: string; // Authentication secret

  @Column({ nullable: true })
  deviceType: string; // 'mobile', 'desktop', etc.

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
