import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { DeviceActivityLogModule } from '../device-activity-log/device-activity-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device]),
    DeviceActivityLogModule,
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
