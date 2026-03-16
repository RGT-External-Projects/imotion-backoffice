import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Session } from '../../session/entities/session.entity';

export enum SessionActivityEventType {
  SESSION_STARTED = 'SESSION_STARTED',
  SETTINGS_CHANGED = 'SETTINGS_CHANGED',
  SESSION_PAUSED = 'SESSION_PAUSED',
  SESSION_RESUMED = 'SESSION_RESUMED',
  SESSION_COMPLETED = 'SESSION_COMPLETED',
  SESSION_INTERRUPTED = 'SESSION_INTERRUPTED',
}

@Entity('session_activity_logs')
@Index(['sessionId'])
@Index(['timestamp'])
@Index(['eventType'])
export class SessionActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id', type: 'uuid' })
  sessionId: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({
    type: 'enum',
    enum: SessionActivityEventType,
    name: 'event_type',
  })
  eventType: SessionActivityEventType;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Session, (session) => session.activityLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;
}
