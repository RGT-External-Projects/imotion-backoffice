import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, FindOptionsWhere } from 'typeorm';
import { Session, SessionStatus, SessionSettings } from './entities/session.entity';
import { SessionActivityLogService } from '../session-activity-log/session-activity-log.service';
import { SessionActivityEventType } from '../session-activity-log/entities/session-activity-log.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { CompleteSessionDto } from './dto/complete-session.dto';
import { InterruptSessionDto } from './dto/interrupt-session.dto';
import { QuerySessionsDto } from './dto/query-sessions.dto';
import { PaginatedSessionsResponseDto } from './dto/paginated-sessions.response.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly activityLogService: SessionActivityLogService,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    // Create session
    const session = new Session();
    session.deviceId = createSessionDto.deviceId;
    session.therapistPhoneId = createSessionDto.therapistPhoneId;
    session.patientId = createSessionDto.patientId;
    session.initialSettings = createSessionDto.initialSettings;
    session.status = SessionStatus.IN_PROGRESS;
    session.sessionTimestamp = createSessionDto.sessionTimestamp 
      ? new Date(createSessionDto.sessionTimestamp)
      : new Date();

    const savedSession = await this.sessionRepository.save(session);

    // Auto-create SESSION_STARTED activity log
    await this.activityLogService.create(
      savedSession.id,
      SessionActivityEventType.SESSION_STARTED,
      `Session ${savedSession.id} started`,
      {
        initialSettings: createSessionDto.initialSettings,
        deviceId: createSessionDto.deviceId,
        therapistPhoneId: createSessionDto.therapistPhoneId,
        patientId: createSessionDto.patientId,
      },
    );

    return savedSession;
  }

  async findAll(): Promise<Session[]> {
    return this.sessionRepository.find({
      relations: ['device', 'therapistPhone', 'patient'],
      order: { sessionTimestamp: 'DESC' },
    });
  }

  async findAllPaginated(query: QuerySessionsDto): Promise<PaginatedSessionsResponseDto> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: FindOptionsWhere<Session> = {};

    // Filter by status
    if (query.status) {
      where.status = query.status;
    }

    // Filter by device
    if (query.deviceId) {
      where.deviceId = query.deviceId;
    }

    // Filter by therapist phone
    if (query.therapistPhoneId) {
      where.therapistPhoneId = query.therapistPhoneId;
    }

    // Filter by patient
    if (query.patientId) {
      where.patientId = query.patientId;
    }

    // Filter by date range
    if (query.startDate && query.endDate) {
      where.sessionTimestamp = Between(
        new Date(query.startDate),
        new Date(query.endDate),
      );
    } else if (query.startDate) {
      where.sessionTimestamp = Between(
        new Date(query.startDate),
        new Date('2100-01-01'), // Far future date
      );
    } else if (query.endDate) {
      where.sessionTimestamp = Between(
        new Date('1970-01-01'), // Far past date
        new Date(query.endDate),
      );
    }

    // Create query builder for search functionality
    const queryBuilder = this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.device', 'device')
      .leftJoinAndSelect('session.therapistPhone', 'therapistPhone')
      .leftJoinAndSelect('session.patient', 'patient')
      .orderBy('session.sessionTimestamp', 'DESC');

    // Apply filters from where clause
    if (query.status) {
      queryBuilder.andWhere('session.status = :status', { status: query.status });
    }
    if (query.deviceId) {
      queryBuilder.andWhere('session.deviceId = :deviceId', { deviceId: query.deviceId });
    }
    if (query.therapistPhoneId) {
      queryBuilder.andWhere('session.therapistPhoneId = :therapistPhoneId', { 
        therapistPhoneId: query.therapistPhoneId 
      });
    }
    if (query.patientId) {
      queryBuilder.andWhere('session.patientId = :patientId', { patientId: query.patientId });
    }
    if (query.startDate && query.endDate) {
      queryBuilder.andWhere('session.sessionTimestamp BETWEEN :startDate AND :endDate', {
        startDate: new Date(query.startDate),
        endDate: new Date(query.endDate),
      });
    } else if (query.startDate) {
      queryBuilder.andWhere('session.sessionTimestamp >= :startDate', {
        startDate: new Date(query.startDate),
      });
    } else if (query.endDate) {
      queryBuilder.andWhere('session.sessionTimestamp <= :endDate', {
        endDate: new Date(query.endDate),
      });
    }

    // Apply search filter (search in session ID, phone number, device name)
    // Note: Cast UUID to text for ILIKE comparison in PostgreSQL
    // ILIKE is case-insensitive version of LIKE
    if (query.search) {
      queryBuilder.andWhere(
        '(CAST(session.id AS TEXT) ILIKE :search OR device.deviceName ILIKE :search OR therapistPhone.phoneNumber ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    // Get total count
    const totalItems = await queryBuilder.getCount();

    // Apply pagination
    const data = await queryBuilder
      .skip(skip)
      .take(limit)
      .getMany();

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data,
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

  async findOne(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['device', 'therapistPhone', 'patient', 'activityLogs'],
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return session;
  }

  async complete(id: string, completeDto: CompleteSessionDto): Promise<Session> {
    const session = await this.findOne(id);

    // Compute final settings from activity logs
    const finalSettings = await this.computeFinalSettings(id, session.initialSettings);

    // Update session
    session.status = SessionStatus.COMPLETED;
    session.duration = completeDto.duration;
    session.finalSettings = finalSettings;

    const updatedSession = await this.sessionRepository.save(session);

    // Create SESSION_COMPLETED log
    await this.activityLogService.create(
      id,
      SessionActivityEventType.SESSION_COMPLETED,
      `Session ${id} completed successfully`,
      {
        duration: completeDto.duration,
        finalSettings,
      },
    );

    return updatedSession;
  }

  async interrupt(id: string, interruptDto: InterruptSessionDto): Promise<Session> {
    const session = await this.findOne(id);

    // Compute final settings from activity logs
    const finalSettings = await this.computeFinalSettings(id, session.initialSettings);

    // Update session
    session.status = SessionStatus.INTERRUPTED;
    session.duration = interruptDto.duration;
    session.finalSettings = finalSettings;

    const updatedSession = await this.sessionRepository.save(session);

    // Create SESSION_INTERRUPTED log
    await this.activityLogService.create(
      id,
      SessionActivityEventType.SESSION_INTERRUPTED,
      `Session ${id} was interrupted`,
      {
        duration: interruptDto.duration,
        reason: interruptDto.reason,
        finalSettings,
      },
    );

    return updatedSession;
  }

  async pause(id: string): Promise<Session> {
    const session = await this.findOne(id);

    session.status = SessionStatus.PAUSED;
    const updatedSession = await this.sessionRepository.save(session);

    // Create SESSION_PAUSED log
    await this.activityLogService.create(
      id,
      SessionActivityEventType.SESSION_PAUSED,
      `Session ${id} was paused`,
    );

    return updatedSession;
  }

  async resume(id: string): Promise<Session> {
    const session = await this.findOne(id);

    session.status = SessionStatus.IN_PROGRESS;
    const updatedSession = await this.sessionRepository.save(session);

    // Create SESSION_RESUMED log
    await this.activityLogService.create(
      id,
      SessionActivityEventType.SESSION_RESUMED,
      `Session ${id} was resumed`,
    );

    return updatedSession;
  }

  async remove(id: string): Promise<void> {
    const session = await this.findOne(id);
    await this.sessionRepository.remove(session);
  }

  async getActivityLogs(id: string) {
    await this.findOne(id); // Verify session exists
    return this.activityLogService.findBySession(id);
  }

  private async computeFinalSettings(
    sessionId: string,
    initialSettings: SessionSettings,
  ): Promise<SessionSettings> {
    // Get all SETTINGS_CHANGED logs
    const settingsChanges = await this.activityLogService.findSettingsChanges(sessionId);

    // Start with initial settings
    const finalSettings: SessionSettings = JSON.parse(JSON.stringify(initialSettings));

    // Apply each change
    for (const log of settingsChanges) {
      // Check if it's multiple changes format
      if (log.metadata?.changes && Array.isArray(log.metadata.changes)) {
        // Apply all changes from the array
        for (const change of log.metadata.changes) {
          if (change.settingPath && change.newValue !== undefined) {
            this.setNestedValue(finalSettings, change.settingPath, change.newValue);
          }
        }
      } else if (log.metadata?.settingPath && log.metadata?.newValue !== undefined) {
        // Legacy single change format
        this.setNestedValue(finalSettings, log.metadata.settingPath, log.metadata.newValue);
      }
    }

    return finalSettings;
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
  }

  private getNestedValue(obj: any, path: string): any {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === undefined || current === null) {
        return undefined;
      }
      current = current[key];
    }

    return current;
  }

  /**
   * Smart activity log creation - auto-fills missing fields for SETTINGS_CHANGED events
   * Supports both single change and multiple changes format
   */
  async createActivityLogSmart(sessionId: string, dto: any): Promise<any> {
    let description = dto.description;
    let metadata = dto.metadata || {};

    // Auto-generate for SETTINGS_CHANGED if missing fields
    if (dto.eventType === SessionActivityEventType.SETTINGS_CHANGED) {
      const session = await this.findOne(sessionId);
      const settingsChanges = await this.activityLogService.findSettingsChanges(sessionId);

      // Check if multiple changes format (with changes array)
      if (metadata.changes && Array.isArray(metadata.changes)) {
        // Process multiple changes
        const processedChanges: Array<{ settingPath: string; oldValue: any; newValue: any }> = [];

        for (const change of metadata.changes) {
          const { settingPath, newValue } = change;
          let { oldValue } = change;

          if (settingPath && newValue !== undefined) {
            // Auto-fill oldValue if missing
            if (oldValue === undefined) {
              // Try to get from most recent activity log first
              const lastChange = settingsChanges.find(
                log => log.metadata?.settingPath === settingPath || 
                       log.metadata?.changes?.some((c: any) => c.settingPath === settingPath)
              );

              if (lastChange) {
                // Check if it's from a changes array
                if (lastChange.metadata?.changes) {
                  const prevChange = lastChange.metadata.changes.find(
                    (c: any) => c.settingPath === settingPath
                  );
                  oldValue = prevChange?.newValue;
                } else if (lastChange.metadata?.settingPath === settingPath) {
                  oldValue = lastChange.metadata.newValue;
                }
              }

              // Fallback to initialSettings
              if (oldValue === undefined) {
                oldValue = this.getNestedValue(session.initialSettings, settingPath);
              }
            }

            processedChanges.push({ settingPath, oldValue, newValue });
          }
        }

        metadata.changes = processedChanges;

        // Generate comprehensive description if missing
        if (!description) {
          if (processedChanges.length === 1) {
            const change = processedChanges[0];
            description = `Changed ${change.settingPath} from ${change.oldValue} to ${change.newValue}`;
          } else {
            const changeDescriptions = processedChanges.map(
              c => `${c.settingPath}: ${c.oldValue} → ${c.newValue}`
            );
            description = `Multiple settings changed: ${changeDescriptions.join(', ')}`;
          }
        }
      } else if (metadata.settingPath && metadata.newValue !== undefined) {
        // Single change format (legacy support)
        const settingPath = metadata.settingPath;
        const newValue = metadata.newValue;

        // Get oldValue if missing
        if (metadata.oldValue === undefined) {
          // Try to get from most recent activity log first
          const lastChange = settingsChanges.find(
            log => log.metadata?.settingPath === settingPath
          );

          if (lastChange && lastChange.metadata?.newValue !== undefined) {
            metadata.oldValue = lastChange.metadata.newValue;
          } else {
            // Fallback to initialSettings
            metadata.oldValue = this.getNestedValue(session.initialSettings, settingPath);
          }
        }

        // Generate description if missing
        if (!description) {
          description = `Changed ${settingPath} from ${metadata.oldValue} to ${newValue}`;
        }
      }
    }

    // Create activity log with completed data
    return this.activityLogService.create(
      sessionId,
      dto.eventType,
      description || 'Activity logged',
      metadata,
    );
  }
}
