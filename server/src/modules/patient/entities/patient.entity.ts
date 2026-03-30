import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Session, SessionSettings } from '../../session/entities/session.entity';
import { TherapistPhone } from '../../therapist-phone/entities/therapist-phone.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_code', unique: true })
  patientCode: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb', default: [] })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ name: 'therapist_phone_id', type: 'uuid', nullable: true })
  therapistPhoneId: string | null;

  @ManyToOne(() => TherapistPhone, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'therapist_phone_id' })
  therapistPhone?: TherapistPhone | null;

  @Column({ type: 'jsonb', nullable: true, name: 'preferred_settings' })
  preferredSettings: SessionSettings | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Session, (session) => session.patient)
  sessions: Session[];
}
