import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TherapistPhone } from '../therapist-phone/entities/therapist-phone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, TherapistPhone])],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
