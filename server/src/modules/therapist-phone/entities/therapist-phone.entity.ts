import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Device } from '../../device/entities/device.entity';
import { Session } from '../../session/entities/session.entity';

@Entity('therapist_phones')
export class TherapistPhone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'phone_number', unique: true })
  phoneNumber: string;

  @Column({ name: 'display_name', nullable: true })
  displayName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToMany(() => Device, (device) => device.therapistPhones)
  @JoinTable({
    name: 'device_therapist_phones',
    joinColumn: { name: 'therapist_phone_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'device_id', referencedColumnName: 'id' },
  })
  devices: Device[];

  @OneToMany(() => Session, (session) => session.therapistPhone)
  sessions: Session[];
}
