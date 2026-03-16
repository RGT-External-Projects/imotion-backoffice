import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TherapistPhone } from './entities/therapist-phone.entity';
import { TherapistPhoneService } from './therapist-phone.service';
import { TherapistPhoneController } from './therapist-phone.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TherapistPhone])],
  controllers: [TherapistPhoneController],
  providers: [TherapistPhoneService],
  exports: [TherapistPhoneService],
})
export class TherapistPhoneModule {}
