import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DayOfWeek } from './types/dayOfWeek.enum';

@Entity('storeHours')
export class StoreHours {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    comment: 'Reference to the store that owns this schedule',
    type: 'uuid',
    nullable: false,
  })
  storeId: string;

  @Column({
    comment: 'Days of the week this schedule applies to',
    type: 'enum',
    enum: DayOfWeek,
    array: true,
    nullable: false,
    default: [],
  })
  dayOfWeek: DayOfWeek[];

  @Column({
    comment: 'Time the store opens — only time portion is relevant (use 2000-01-01 as base date)',
    type: 'timestamp',
    nullable: true,
  })
  opensAt: Date | null;

  @Column({
    comment: 'Time the store closes — only time portion is relevant (use 2000-01-01 as base date)',
    type: 'timestamp',
    nullable: true,
  })
  closesAt: Date | null;

  @Column({
    comment: 'If true, ignore opensAt/closesAt and consider the entire day',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isAllDay: boolean;

  @Column({
    comment: 'Whether this schedule entry is active. False = day is closed or override disabled',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
