import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class UserSnapshot {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  account: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  lastUpdatedAt: Date;
}
