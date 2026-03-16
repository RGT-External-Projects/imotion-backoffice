import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session, SessionStatus, SessionSettings } from './entities/session.entity';
import { SessionActivityLogService } from '../session-activity-log/session-activity-log.service';
import { SessionActivityEventType } from '../session-activity-log/entities/session-activity-log.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { CompleteSessionDto } from './dto/complete-session.dto';
import { InterruptSessionDto } from './dto/interrupt-session.dto';

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
      if (log.metadata?.settingPath && log.metadata?.newValue !== undefined) {
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
}
