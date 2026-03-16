import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SessionActivityLog,
  SessionActivityEventType,
} from './entities/session-activity-log.entity';

@Injectable()
export class SessionActivityLogService {
  constructor(
    @InjectRepository(SessionActivityLog)
    private readonly sessionActivityLogRepository: Repository<SessionActivityLog>,
  ) {}

  async create(
    sessionId: string,
    eventType: SessionActivityEventType,
    description: string,
    metadata?: Record<string, any>,
  ): Promise<SessionActivityLog> {
    const log = this.sessionActivityLogRepository.create({
      sessionId,
      eventType,
      description,
      metadata,
      timestamp: new Date(),
    });

    return this.sessionActivityLogRepository.save(log);
  }

  async findBySession(sessionId: string): Promise<SessionActivityLog[]> {
    return this.sessionActivityLogRepository.find({
      where: { sessionId },
      order: { timestamp: 'ASC' },
    });
  }

  async findSettingsChanges(sessionId: string): Promise<SessionActivityLog[]> {
    return this.sessionActivityLogRepository.find({
      where: {
        sessionId,
        eventType: SessionActivityEventType.SETTINGS_CHANGED,
      },
      order: { timestamp: 'ASC' },
    });
  }
}
