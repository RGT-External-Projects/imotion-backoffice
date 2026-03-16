import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { TherapistPhone } from '../../therapist-phone/entities/therapist-phone.entity';
import { Session } from '../../session/entities/session.entity';
import { DeviceActivityLog } from '../../device-activity-log/entities/device-activity-log.entity';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'device_id', unique: true })
  deviceId: string;

  @Column({ name: 'device_name', nullable: true })
  deviceName: string;

  @Column({ name: 'serial_number', nullable: true, unique: true })
  serialNumber: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'firmware_version', nullable: true })
  firmwareVersion: string;

  @Column({ name: 'last_connected', type: 'timestamp', nullable: true })
  lastConnected: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToMany(() => TherapistPhone, (phone) => phone.devices)
  therapistPhones: TherapistPhone[];

  @OneToMany(() => Session, (session) => session.device)
  sessions: Session[];

  @OneToMany(() => DeviceActivityLog, (log) => log.device)
  activityLogs: DeviceActivityLog[];
}
