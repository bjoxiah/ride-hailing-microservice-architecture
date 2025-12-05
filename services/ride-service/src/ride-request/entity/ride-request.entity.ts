import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RideRequest {
  // Use "uuid" strategy and string type
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @Column({ nullable: true })
  driverId?: string | null;

  @Column()
  originCoordinates: string;

  @Column()
  originName: string;

  @Column()
  destinationCoordinates: string;

  @Column()
  destinationName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
