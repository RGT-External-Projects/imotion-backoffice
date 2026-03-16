import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { DeviceActivityLogService } from '../device-activity-log/device-activity-log.service';
import { DeviceActivityEventType } from '../device-activity-log/entities/device-activity-log.entity';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { ConnectDeviceDto } from './dto/connect-device.dto';
import { UpdateFirmwareDto } from './dto/update-firmware.dto';
import { PairPhoneDto } from './dto/pair-phone.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly activityLogService: DeviceActivityLogService,
  ) {}

  async register(registerDto: RegisterDeviceDto): Promise<Device> {
    // Check if device already exists
    const existing = await this.deviceRepository.findOne({
      where: [
        { deviceId: registerDto.deviceId },
        { serialNumber: registerDto.serialNumber },
      ],
    });

    if (existing) {
      throw new ConflictException(
        `Device with ID ${registerDto.deviceId} or serial ${registerDto.serialNumber} already exists`,
      );
    }

    // Create device
    const device = new Device();
    device.deviceId = registerDto.deviceId;
    device.serialNumber = registerDto.serialNumber;
    device.deviceName = registerDto.model || registerDto.deviceId;
    if (registerDto.firmwareVersion) {
      device.firmwareVersion = registerDto.firmwareVersion;
    }
    device.isActive = true;

    const savedDevice = await this.deviceRepository.save(device);

    // Auto-create DEVICE_REGISTERED log
    await this.activityLogService.create(
      savedDevice.id,
      DeviceActivityEventType.DEVICE_REGISTERED,
      `Device ${savedDevice.deviceId} registered in the system`,
      {
        deviceId: savedDevice.deviceId,
        serialNumber: savedDevice.serialNumber,
        model: savedDevice.deviceName,
        firmwareVersion: savedDevice.firmwareVersion,
      },
    );

    return savedDevice;
  }

  async findAll(): Promise<Device[]> {
    return this.deviceRepository.find({
      relations: ['therapistPhones'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { id },
      relations: ['therapistPhones', 'sessions', 'activityLogs'],
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    return device;
  }

  async connect(id: string, connectDto: ConnectDeviceDto): Promise<void> {
    const device = await this.findOne(id);

    // Update last connected timestamp
    device.lastConnected = new Date();
    await this.deviceRepository.save(device);

    // Create DEVICE_CONNECTED log
    await this.activityLogService.create(
      id,
      DeviceActivityEventType.DEVICE_CONNECTED,
      `Device ${device.deviceId} connected via Bluetooth`,
      {
        therapistPhoneId: connectDto.therapistPhoneId,
        batteryLevel: connectDto.batteryLevel,
        signalStrength: connectDto.signalStrength,
        connectionType: 'bluetooth',
      },
    );
  }

  async disconnect(id: string, therapistPhoneId: string): Promise<void> {
    const device = await this.findOne(id);

    // Create DEVICE_DISCONNECTED log
    await this.activityLogService.create(
      id,
      DeviceActivityEventType.DEVICE_DISCONNECTED,
      `Device ${device.deviceId} disconnected`,
      {
        therapistPhoneId,
        disconnectReason: 'session_ended',
      },
    );
  }

  async updateFirmware(id: string, updateDto: UpdateFirmwareDto): Promise<Device> {
    const device = await this.findOne(id);
    const oldVersion = device.firmwareVersion;

    device.firmwareVersion = updateDto.newVersion;
    const updatedDevice = await this.deviceRepository.save(device);

    // Create FIRMWARE_UPDATED log
    await this.activityLogService.create(
      id,
      DeviceActivityEventType.FIRMWARE_UPDATED,
      `Firmware updated from ${oldVersion || 'N/A'} to ${updateDto.newVersion}`,
      {
        oldVersion,
        newVersion: updateDto.newVersion,
        updateMethod: 'manual',
      },
    );

    return updatedDevice;
  }

  async pairPhone(id: string, pairDto: PairPhoneDto): Promise<void> {
    const device = await this.findOne(id);

    // Note: Actual pairing logic would insert into device_therapist_phones junction table
    // For now, we just log the event
    await this.activityLogService.create(
      id,
      DeviceActivityEventType.THERAPIST_PHONE_CONNECTED,
      `Device ${device.deviceId} paired with therapist phone`,
      {
        therapistPhoneId: pairDto.therapistPhoneId,
      },
    );
  }

  async unpairPhone(id: string, phoneId: string): Promise<void> {
    const device = await this.findOne(id);

    // Note: Actual unpairing logic would delete from device_therapist_phones junction table
    // For now, we just log the event
    await this.activityLogService.create(
      id,
      DeviceActivityEventType.THERAPIST_PHONE_DISCONNECTED,
      `Device ${device.deviceId} unpaired from therapist phone`,
      {
        therapistPhoneId: phoneId,
      },
    );
  }

  async getActivityLogs(id: string) {
    await this.findOne(id); // Verify device exists
    return this.activityLogService.findByDevice(id);
  }

  async getSessions(id: string) {
    const device = await this.findOne(id);
    return device.sessions;
  }

  async getTherapistPhones(id: string) {
    const device = await this.findOne(id);
    return device.therapistPhones;
  }

  async remove(id: string): Promise<void> {
    const device = await this.findOne(id);
    await this.deviceRepository.remove(device);
  }
}
