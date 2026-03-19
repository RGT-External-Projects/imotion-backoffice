import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Device } from './entities/device.entity';
import { TherapistPhone } from '../therapist-phone/entities/therapist-phone.entity';
import { DeviceActivityLogService } from '../device-activity-log/device-activity-log.service';
import { DeviceActivityEventType } from '../device-activity-log/entities/device-activity-log.entity';
import { TherapistPhoneService } from '../therapist-phone/therapist-phone.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { ConnectDeviceDto } from './dto/connect-device.dto';
import { UpdateFirmwareDto } from './dto/update-firmware.dto';
import { PairPhoneDto } from './dto/pair-phone.dto';
import { QueryDevicesDto } from './dto/query-devices.dto';
import { PaginatedDevicesResponseDto } from './dto/paginated-devices.response.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(TherapistPhone)
    private readonly therapistPhoneRepository: Repository<TherapistPhone>,
    private readonly dataSource: DataSource,
    private readonly activityLogService: DeviceActivityLogService,
    private readonly therapistPhoneService: TherapistPhoneService,
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

  /**
   * Get all devices with pagination, filtering, and search
   */
  async findAllPaginated(query: QueryDevicesDto): Promise<PaginatedDevicesResponseDto> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Create query builder
    const queryBuilder = this.deviceRepository
      .createQueryBuilder('device')
      .leftJoin('device.sessions', 'session')
      .leftJoin('device.activityLogs', 'log')
      .select([
        'device.id',
        'device.deviceId',
        'device.deviceName',
        'device.serialNumber',
        'device.isActive',
        'device.firmwareVersion',
        'device.lastConnected',
        'device.createdAt',
        'device.updatedAt',
      ])
      .addSelect('COUNT(DISTINCT session.id)', 'sessionCount')
      .groupBy('device.id');

    // Apply filters
    if (query.isActive !== undefined) {
      queryBuilder.andWhere('device.isActive = :isActive', { isActive: query.isActive });
    }

    if (query.firmwareVersion) {
      queryBuilder.andWhere('device.firmwareVersion = :firmwareVersion', { 
        firmwareVersion: query.firmwareVersion 
      });
    }

    // Apply search (case-insensitive)
    if (query.search) {
      queryBuilder.andWhere(
        '(CAST(device.id AS TEXT) ILIKE :search OR device.deviceId ILIKE :search OR device.deviceName ILIKE :search OR device.serialNumber ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    // Order by creation date
    queryBuilder.orderBy('device.createdAt', 'DESC');

    // Get total count
    const totalItems = await queryBuilder.getCount();

    // Apply pagination
    const devices = await queryBuilder
      .skip(skip)
      .take(limit)
      .getRawAndEntities();

    // Enrich devices with additional data
    const enrichedDevices = await Promise.all(
      devices.entities.map(async (device, index) => {
        const sessionCount = parseInt(devices.raw[index].sessionCount) || 0;

        // Get last connected therapist phone from activity logs
        const lastConnectionLog = await this.dataSource
          .getRepository('DeviceActivityLog')
          .createQueryBuilder('log')
          .where('log.device_id = :deviceId', { deviceId: device.id })
          .andWhere('log.event_type = :eventType', { eventType: 'DEVICE_CONNECTED' })
          .orderBy('log.timestamp', 'DESC')
          .limit(1)
          .getRawOne();

        let lastConnectedPhone: TherapistPhone | null = null;
        if (lastConnectionLog && lastConnectionLog.log_metadata?.therapistPhoneId) {
          lastConnectedPhone = await this.therapistPhoneRepository.findOne({
            where: { id: lastConnectionLog.log_metadata.therapistPhoneId },
          });
        }

        return {
          id: device.id,
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          serialNumber: device.serialNumber,
          isActive: device.isActive,
          firmwareVersion: device.firmwareVersion,
          lastConnected: device.lastConnected,
          createdAt: device.createdAt,
          updatedAt: device.updatedAt,
          sessionCount,
          lastConnectedPhone: lastConnectedPhone ? {
            id: lastConnectedPhone.id,
            phoneNumber: lastConnectedPhone.phoneNumber,
            displayName: lastConnectedPhone.displayName,
          } : null,
        };
      })
    );

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: enrichedDevices,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  /**
   * Get all devices with enriched data for UI (Legacy - for backward compatibility)
   * Returns: device info + session count + last connected phone
   */
  async findAll(): Promise<any[]> {
    // Use QueryBuilder for efficient queries with counts
    const devices = await this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.sessions', 'session')
      .leftJoinAndSelect('device.activityLogs', 'log')
      .orderBy('device.createdAt', 'DESC')
      .getMany();

    // Enrich each device with computed data
    const enrichedDevices = await Promise.all(
      devices.map(async (device) => {
        // Get total session count
        const sessionCount = device.sessions?.length || 0;

        // Get last connected therapist phone from activity logs
        // Find most recent DEVICE_CONNECTED log
        const lastConnectionLog = device.activityLogs
          ?.filter(log => log.eventType === 'DEVICE_CONNECTED')
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        let lastConnectedPhone: TherapistPhone | null = null;
        if (lastConnectionLog && lastConnectionLog.metadata?.therapistPhoneId) {
          // Fetch the therapist phone details
          lastConnectedPhone = await this.therapistPhoneRepository.findOne({
            where: { id: lastConnectionLog.metadata.therapistPhoneId },
          });
        }

        return {
          id: device.id,
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          serialNumber: device.serialNumber,
          isActive: device.isActive,
          firmwareVersion: device.firmwareVersion,
          lastConnected: device.lastConnected,
          createdAt: device.createdAt,
          updatedAt: device.updatedAt,
          // Computed/enriched fields
          sessionCount,
          lastConnectedPhone: lastConnectedPhone ? {
            id: lastConnectedPhone.id,
            phoneNumber: lastConnectedPhone.phoneNumber,
            displayName: lastConnectedPhone.displayName,
          } : null,
        };
      })
    );

    return enrichedDevices;
  }

  /**
   * Get single device with all related data
   * Returns: device + sessions + activity logs + therapist phones + computed statistics
   */
  async findOne(id: string): Promise<any> {
    const device = await this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.therapistPhones', 'phone')
      .leftJoinAndSelect('device.sessions', 'session')
      .leftJoinAndSelect('session.therapistPhone', 'sessionTherapistPhone')
      .leftJoinAndSelect('session.patient', 'sessionPatient')
      .leftJoinAndSelect('device.activityLogs', 'log')
      .where('device.id = :id', { id })
      .orderBy('log.timestamp', 'DESC')
      .addOrderBy('session.sessionTimestamp', 'DESC')
      .getOne();

    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    // Calculate usage statistics
    const totalSessions = device.sessions?.length || 0;
    
    const avgSessionDuration = device.sessions?.length > 0
      ? device.sessions.reduce((sum, session) => sum + (session.duration || 0), 0) / device.sessions.length
      : 0;
    
    const phonesConnected = device.therapistPhones?.length || 0;

    // Enrich therapist phones with session count and last connected time
    const enrichedPhones = await Promise.all(
      (device.therapistPhones || []).map(async (phone) => {
        // Count sessions run by this phone on this device
        const sessionCount = await this.dataSource
          .getRepository('Session')
          .createQueryBuilder('session')
          .where('session.device_id = :deviceId', { deviceId: device.id })
          .andWhere('session.therapist_phone_id = :phoneId', { phoneId: phone.id })
          .getCount();

        // Find last connection from activity logs
        const lastConnectionLog = device.activityLogs
          ?.filter(log => 
            log.eventType === 'DEVICE_CONNECTED' && 
            log.metadata?.therapistPhoneId === phone.id
          )
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        return {
          id: phone.id,
          phoneNumber: phone.phoneNumber,
          displayName: phone.displayName,
          createdAt: phone.createdAt,
          updatedAt: phone.updatedAt,
          // Enriched fields for UI
          sessionsRun: sessionCount,
          lastConnected: lastConnectionLog?.timestamp || phone.updatedAt,
        };
      })
    );

    // Return device with computed statistics and enriched phones
    return {
      ...device,
      therapistPhones: enrichedPhones,
      statistics: {
        totalSessions,
        avgSessionDuration,  // in seconds
        avgSessionDurationFormatted: this.formatDuration(avgSessionDuration),
        phonesConnected,
      },
    };
  }

  /**
   * Format duration from seconds to readable string
   */
  private formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
  }

  /**
   * Connect to device with auto-registration
   * Uses database transactions for atomicity and proper isolation
   * @param connectDto - Connection details including phone and device info
   * @returns Device and therapist phone ID
   */
  async connect(connectDto: ConnectDeviceDto): Promise<{ device: Device; therapistPhoneId: string }> {
    // Use a transaction to ensure atomicity
    // If any step fails, everything rolls back
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED'); // Prevent dirty reads

    try {
      // STEP 1: Find or create therapist phone with pessimistic write lock
      // This prevents race conditions when multiple requests try to register same phone
      let therapistPhone = await queryRunner.manager.findOne(TherapistPhone, {
        where: { phoneNumber: connectDto.phoneUniqueId },
        lock: { mode: 'pessimistic_write' }, // Lock row for update
      });

      if (!therapistPhone) {
        // Auto-register therapist phone
        therapistPhone = queryRunner.manager.create(TherapistPhone, {
          phoneNumber: connectDto.phoneUniqueId,
          displayName: connectDto.phoneModel || connectDto.phoneNumber || 'Unknown Phone',
        });
        therapistPhone = await queryRunner.manager.save(TherapistPhone, therapistPhone);
      }

      // STEP 2: Find or create device with pessimistic write lock
      let device = await queryRunner.manager.findOne(Device, {
        where: { deviceId: connectDto.deviceId },
        lock: { mode: 'pessimistic_write' }, // Lock row for update
      });

      let isNewDevice = false;
      if (!device) {
        // Auto-register device
        device = queryRunner.manager.create(Device, {
          deviceId: connectDto.deviceId,
          serialNumber: connectDto.serialNumber || connectDto.deviceId,
          deviceName: connectDto.model || connectDto.deviceId,
          firmwareVersion: connectDto.firmwareVersion,
          isActive: true,
          lastConnected: new Date(),
        });
        device = await queryRunner.manager.save(Device, device);
        isNewDevice = true;
      } else {
        // Update last connected timestamp (row is locked)
        device.lastConnected = new Date();
        await queryRunner.manager.save(Device, device);
      }

      // STEP 3: Link device and therapist phone in junction table
      // Check if the relationship already exists
      const existingLink = await queryRunner.manager
        .createQueryBuilder()
        .select()
        .from('device_therapist_phones', 'dtp')
        .where('dtp.device_id = :deviceId', { deviceId: device.id })
        .andWhere('dtp.therapist_phone_id = :phoneId', { phoneId: therapistPhone.id })
        .getRawOne();

      if (!existingLink) {
        // Insert into junction table
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into('device_therapist_phones')
          .values({
            device_id: device.id,
            therapist_phone_id: therapistPhone.id,
          })
          .execute();
      }

      // Commit transaction - all operations succeed together
      await queryRunner.commitTransaction();

      // Log activities AFTER successful commit (outside transaction to prevent deadlocks)
      try {
        if (isNewDevice) {
          await this.activityLogService.create(
            device.id,
            DeviceActivityEventType.DEVICE_REGISTERED,
            `Device ${device.deviceId} registered in the system`,
            {
              deviceId: device.deviceId,
              serialNumber: device.serialNumber,
              model: device.deviceName,
              firmwareVersion: device.firmwareVersion,
              autoRegistered: true,
            },
          );
        }

        await this.activityLogService.create(
          device.id,
          DeviceActivityEventType.DEVICE_CONNECTED,
          `Device ${device.deviceId} connected via Bluetooth`,
          {
            therapistPhoneId: therapistPhone.id,
            phoneModel: connectDto.phoneModel,
            phoneNumber: connectDto.phoneNumber,
            batteryLevel: connectDto.batteryLevel,
            signalStrength: connectDto.signalStrength,
            connectionType: 'bluetooth',
            isNewDevice,
          },
        );
      } catch (logError) {
        // Log errors but don't fail the connection
        console.error('Failed to create activity logs:', logError);
      }

      return {
        device,
        therapistPhoneId: therapistPhone.id,
      };
    } catch (error) {
      // Rollback transaction on any error - maintains data integrity
      await queryRunner.rollbackTransaction();
      throw error; // Re-throw for proper error handling upstream
    } finally {
      // Release query runner resources
      await queryRunner.release();
    }
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
    
    // Enrich each phone with session count and last connected time
    const enrichedPhones = await Promise.all(
      device.therapistPhones.map(async (phone) => {
        // Count sessions run by this phone on this device
        const sessionCount = await this.dataSource
          .getRepository('Session')
          .createQueryBuilder('session')
          .where('session.device_id = :deviceId', { deviceId: device.id })
          .andWhere('session.therapist_phone_id = :phoneId', { phoneId: phone.id })
          .getCount();

        // Find last connection from activity logs
        const lastConnectionLog = device.activityLogs
          ?.filter(log => 
            log.eventType === 'DEVICE_CONNECTED' && 
            log.metadata?.therapistPhoneId === phone.id
          )
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        return {
          id: phone.id,
          phoneNumber: phone.phoneNumber,
          displayName: phone.displayName,
          createdAt: phone.createdAt,
          updatedAt: phone.updatedAt,
          // Enriched fields for UI
          sessionsRun: sessionCount,
          lastConnected: lastConnectionLog?.timestamp || phone.updatedAt,
        };
      })
    );

    return enrichedPhones;
  }

  async remove(id: string): Promise<void> {
    const device = await this.findOne(id);
    await this.deviceRepository.remove(device);
  }
}
