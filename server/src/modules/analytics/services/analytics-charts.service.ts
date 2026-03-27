import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../../session/entities/session.entity';
import { Device } from '../../device/entities/device.entity';
import { TherapistPhone } from '../../therapist-phone/entities/therapist-phone.entity';
import { AnalyticsQueryDto } from '../dto/analytics-query.dto';
import { SessionsOverTimeResponseDto } from '../dto/response/sessions-over-time.response.dto';
import { DeviceUsageResponseDto } from '../dto/response/device-usage.response.dto';
import { StimuliBreakdownResponseDto } from '../dto/response/stimuli-breakdown.response.dto';
import { SessionDurationDistributionResponseDto } from '../dto/response/session-duration-distribution.response.dto';
import { TherapistActivityResponseDto } from '../dto/response/therapist-activity.response.dto';
import { AnalyticsHelperService } from './analytics-helper.service';

@Injectable()
export class AnalyticsChartsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(TherapistPhone)
    private readonly therapistPhoneRepository: Repository<TherapistPhone>,
    private readonly helperService: AnalyticsHelperService,
  ) {}

  /**
   * Get sessions over time (grouped by date)
   */
  async getSessionsOverTime(
    filters: AnalyticsQueryDto,
  ): Promise<SessionsOverTimeResponseDto> {
    let queryBuilder = this.sessionRepository.createQueryBuilder('session');
    queryBuilder = this.helperService.applyFilters(queryBuilder, filters);

    const results = await queryBuilder
      .select("DATE(session.sessionTimestamp)", 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('DATE(session.sessionTimestamp)')
      .orderBy('date', 'ASC')
      .getRawMany();

    const data = results.map((row) => ({
      date: row.date,
      count: parseInt(row.count),
    }));

    return { data };
  }

  /**
   * Get device usage statistics
   */
  async getDeviceUsage(
    filters: AnalyticsQueryDto,
  ): Promise<DeviceUsageResponseDto> {
    let queryBuilder = this.sessionRepository.createQueryBuilder('session');
    queryBuilder = this.helperService.applyFilters(queryBuilder, filters);

    const results = await queryBuilder
      .leftJoinAndSelect('session.device', 'device')
      .select('session.deviceId', 'deviceId')
      .addSelect('device.deviceName', 'deviceName')
      .addSelect('COUNT(*)', 'sessioncount')
      .groupBy('session.deviceId')
      .addGroupBy('device.deviceName')
      .orderBy('sessioncount', 'DESC')
      .limit(filters.limit || 999)
      .getRawMany();

    // Calculate total sessions for percentage
    const totalSessions = results.reduce(
      (sum, row) => sum + parseInt(row.sessioncount),
      0,
    );

    const devices = results.map((row) => ({
      deviceId: row.deviceId,
      deviceName: row.deviceName || 'Unknown Device',
      sessionCount: parseInt(row.sessioncount),
      usagePercentage:
        totalSessions > 0
          ? Math.round((parseInt(row.sessioncount) / totalSessions) * 100)
          : 0,
    }));

    return { devices };
  }

  /**
   * Get stimuli breakdown (percentage of each type)
   */
  async getStimuliBreakdown(
    filters: AnalyticsQueryDto,
  ): Promise<StimuliBreakdownResponseDto> {
    let queryBuilder = this.sessionRepository.createQueryBuilder('session');
    queryBuilder = this.helperService.applyFilters(queryBuilder, filters);

    const sessions = await queryBuilder
      .select('session.initialSettings')
      .getMany();

    let visualCount = 0;
    let audioCount = 0;
    let vibrationCount = 0;
    const total = sessions.length;

    sessions.forEach((session) => {
      const stimuli = this.helperService.extractStimuliTypes(
        session.initialSettings,
      );

      if (stimuli.includes('Visual')) visualCount++;
      if (stimuli.includes('Audio')) audioCount++;
      if (stimuli.includes('Vibration')) vibrationCount++;
    });

    return {
      visual: total > 0 ? Math.round((visualCount / total) * 100) : 0,
      audio: total > 0 ? Math.round((audioCount / total) * 100) : 0,
      vibration: total > 0 ? Math.round((vibrationCount / total) * 100) : 0,
    };
  }

  /**
   * Get session duration distribution
   */
  async getSessionDurationDistribution(
    filters: AnalyticsQueryDto,
  ): Promise<SessionDurationDistributionResponseDto> {
    let queryBuilder = this.sessionRepository.createQueryBuilder('session');
    queryBuilder = this.helperService.applyFilters(queryBuilder, filters);

    const sessions = await queryBuilder
      .select('session.duration')
      .where('session.duration IS NOT NULL')
      .getMany();

    // Define buckets (in seconds)
    const buckets = [
      { range: '0-5 min', min: 0, max: 300, count: 0 },
      { range: '5-10 min', min: 300, max: 600, count: 0 },
      { range: '10-15 min', min: 600, max: 900, count: 0 },
      { range: '15-20 min', min: 900, max: 1200, count: 0 },
      { range: '20+ min', min: 1200, max: Infinity, count: 0 },
    ];

    sessions.forEach((session) => {
      const duration = session.duration;
      const bucket = buckets.find(
        (b) => duration >= b.min && duration < b.max,
      );
      if (bucket) {
        bucket.count++;
      }
    });

    return {
      buckets: buckets.map((b) => ({ range: b.range, count: b.count })),
    };
  }

  /**
   * Get therapist activity statistics
   */
  async getTherapistActivity(
    filters: AnalyticsQueryDto,
  ): Promise<TherapistActivityResponseDto> {
    let queryBuilder = this.sessionRepository.createQueryBuilder('session');
    queryBuilder = this.helperService.applyFilters(queryBuilder, filters);

    const results = await queryBuilder
      .leftJoinAndSelect('session.therapistPhone', 'therapistPhone')
      .select('session.therapistPhoneId', 'therapistPhoneId')
      .addSelect('therapistPhone.phoneNumber', 'phoneNumber')
      .addSelect('COUNT(*)', 'sessioncount')
      .groupBy('session.therapistPhoneId')
      .addGroupBy('therapistPhone.phoneNumber')
      .orderBy('sessioncount', 'DESC')
      .getRawMany();

    const therapists = results.map((row, index) => ({
      therapistPhoneId: row.therapistPhoneId,
      displayName: row.phoneNumber || `Therapist ${index + 1}`,
      sessionCount: parseInt(row.sessioncount),
    }));

    return { therapists };
  }
}
