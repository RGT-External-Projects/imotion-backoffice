import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('notification_settings')
export class NotificationSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  // Email Notifications
  @Column({ name: 'email_session_completed', default: true })
  emailSessionCompleted: boolean;

  @Column({ name: 'email_new_device', default: false })
  emailNewDevice: boolean;

  @Column({ name: 'email_daily_summary', default: true })
  emailDailySummary: boolean;

  // Push Notifications
  @Column({ name: 'push_device_disconnected', default: true })
  pushDeviceDisconnected: boolean;

  @Column({ name: 'push_session_interrupted', default: true })
  pushSessionInterrupted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
