import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Device } from '../device/entities/device.entity';
import { TherapistPhone } from '../therapist-phone/entities/therapist-phone.entity';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionActivityLogModule } from '../session-activity-log/session-activity-log.module';
import { DeviceActivityLogModule } from '../device-activity-log/device-activity-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Device, TherapistPhone]),
    SessionActivityLogModule,
    DeviceActivityLogModule,
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
