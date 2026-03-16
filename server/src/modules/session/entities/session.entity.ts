import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Device } from '../../device/entities/device.entity';
import { TherapistPhone } from '../../therapist-phone/entities/therapist-phone.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { SessionActivityLog } from '../../session-activity-log/entities/session-activity-log.entity';

export enum SessionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  INTERRUPTED = 'INTERRUPTED',
}

export interface SessionSettings {
  visual: {
    enabled: boolean;
    color: string;
    speed: number;
    movement: string;
  };
  vibration: {
    enabled: boolean;
    intensity: number;
    pulse: string;
    speed: number;
  };
  audio: {
    enabled: boolean;
    volume?: number;
    type?: string;
  };
}

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'device_id', type: 'uuid' })
  deviceId: string;

  @Column({ name: 'therapist_phone_id', type: 'uuid' })
  therapistPhoneId: string;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;

  @Column({ type: 'jsonb', name: 'initial_settings' })
  initialSettings: SessionSettings;

  @Column({ type: 'jsonb', name: 'final_settings', nullable: true })
  finalSettings: SessionSettings;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.IN_PROGRESS,
  })
  status: SessionStatus;

  @Column({ name: 'duration', type: 'int', nullable: true, comment: 'Duration in seconds' })
  duration: number;

  @Column({ name: 'session_timestamp', type: 'timestamp' })
  sessionTimestamp: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Device, (device) => device.sessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'device_id' })
  device: Device;

  @ManyToOne(() => TherapistPhone, (phone) => phone.sessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'therapist_phone_id' })
  therapistPhone: TherapistPhone;

  @ManyToOne(() => Patient, (patient) => patient.sessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @OneToMany(() => SessionActivityLog, (log) => log.session)
  activityLogs: SessionActivityLog[];
}
