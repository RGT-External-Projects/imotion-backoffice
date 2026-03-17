import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { Device } from './entities/device.entity';
import { TherapistPhone } from '../therapist-phone/entities/therapist-phone.entity';
import { DeviceActivityLogModule } from '../device-activity-log/device-activity-log.module';
import { TherapistPhoneModule } from '../therapist-phone/therapist-phone.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device, TherapistPhone]),
    DeviceActivityLogModule,
    TherapistPhoneModule,
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
