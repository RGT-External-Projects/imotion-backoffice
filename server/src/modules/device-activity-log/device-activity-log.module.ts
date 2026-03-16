import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceActivityLog } from './entities/device-activity-log.entity';
import { DeviceActivityLogService } from './device-activity-log.service';
import { DeviceActivityLogController } from './device-activity-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceActivityLog])],
  controllers: [DeviceActivityLogController],
  providers: [DeviceActivityLogService],
  exports: [DeviceActivityLogService],
})
export class DeviceActivityLogModule {}
