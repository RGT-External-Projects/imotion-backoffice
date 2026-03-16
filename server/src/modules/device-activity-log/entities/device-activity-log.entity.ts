import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Device } from '../../device/entities/device.entity';

export enum DeviceActivityEventType {
  DEVICE_REGISTERED = 'DEVICE_REGISTERED',
  DEVICE_CONNECTED = 'DEVICE_CONNECTED',
  DEVICE_DISCONNECTED = 'DEVICE_DISCONNECTED',
  FIRMWARE_UPDATED = 'FIRMWARE_UPDATED',
  SESSION_STARTED = 'SESSION_STARTED',
  SESSION_COMPLETED = 'SESSION_COMPLETED',
  THERAPIST_PHONE_CONNECTED = 'THERAPIST_PHONE_CONNECTED',
  THERAPIST_PHONE_DISCONNECTED = 'THERAPIST_PHONE_DISCONNECTED',
}

@Entity('device_activity_logs')
@Index(['deviceId'])
@Index(['timestamp'])
@Index(['eventType'])
export class DeviceActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'device_id', type: 'uuid' })
  deviceId: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({
    type: 'enum',
    enum: DeviceActivityEventType,
    name: 'event_type',
  })
  eventType: DeviceActivityEventType;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Device, (device) => device.activityLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'device_id' })
  device: Device;
}
