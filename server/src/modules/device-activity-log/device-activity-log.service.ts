import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DeviceActivityLog,
  DeviceActivityEventType,
} from './entities/device-activity-log.entity';

@Injectable()
export class DeviceActivityLogService {
  constructor(
    @InjectRepository(DeviceActivityLog)
    private readonly deviceActivityLogRepository: Repository<DeviceActivityLog>,
  ) {}

  async create(
    deviceId: string,
    eventType: DeviceActivityEventType,
    description: string,
    metadata?: Record<string, any>,
  ): Promise<DeviceActivityLog> {
    const log = this.deviceActivityLogRepository.create({
      deviceId,
      eventType,
      description,
      metadata,
      timestamp: new Date(),
    });

    return this.deviceActivityLogRepository.save(log);
  }

  async findByDevice(deviceId: string): Promise<DeviceActivityLog[]> {
    return this.deviceActivityLogRepository.find({
      where: { deviceId },
      order: { timestamp: 'DESC' },
    });
  }
}
