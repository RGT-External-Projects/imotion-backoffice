import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../../session/entities/session.entity';
import { Device } from '../../device/entities/device.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { AnalyticsQueryDto } from '../dto/analytics-query.dto';
import { DashboardStatsResponseDto } from '../dto/response/dashboard-stats.response.dto';
import { AnalyticsStatsResponseDto } from '../dto/response/analytics-stats.response.dto';
import { AnalyticsHelperService } from './analytics-helper.service';

@Injectable()
export class AnalyticsStatsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly helperService: AnalyticsHelperService,
  ) {}

  /**
   * Get dashboard stats (always today)
   */
  async getDashboardStats(): Promise<DashboardStatsResponseDto> {
    const { start, end } = this.helperService.getTodayRange();

    // Count sessions today
    const sessionsToday = await this.sessionRepository
      .createQueryBuilder('session')
      .where('session.sessionTimestamp >= :start', { start })
      .andWhere('session.sessionTimestamp <= :end', { end })
      .getCount();

    // Count active devices (devices with sessions today)
    const activeDevices = await this.sessionRepository
      .createQueryBuilder('session')
      .select('COUNT(DISTINCT session.deviceId)', 'count')
      .where('session.sessionTimestamp >= :start', { start })
      .andWhere('session.sessionTimestamp <= :end', { end })
      .getRawOne();

    // Count total patients
    const totalPatients = await this.patientRepository.count();

    // Calculate average session duration today
    const avgDuration = await this.sessionRepository
      .createQueryBuilder('session')
      .select('AVG(session.duration)', 'avg')
      .where('session.sessionTimestamp >= :start', { start })
      .andWhere('session.sessionTimestamp <= :end', { end })
      .andWhere('session.duration IS NOT NULL')
      .getRawOne();

    return {
      sessionsToday,
      activeDevices: parseInt(activeDevices.count) || 0,
      totalPatients,
      avgSessionDuration: this.helperService.formatDuration(
        avgDuration.avg || 0,
      ),
    };
  }

  /**
   * Get analytics stats (filterable)
   */
  async getAnalyticsStats(
    filters: AnalyticsQueryDto,
  ): Promise<AnalyticsStatsResponseDto> {
    // Count total sessions with filters
    let queryBuilder = this.sessionRepository.createQueryBuilder('session');
    queryBuilder = this.helperService.applyFilters(queryBuilder, filters);
    const totalSessions = await queryBuilder.getCount();

    // Count active devices with filters
    queryBuilder = this.sessionRepository.createQueryBuilder('session');
    queryBuilder = this.helperService.applyFilters(queryBuilder, filters);
    const activeDevicesResult = await queryBuilder
      .select('COUNT(DISTINCT session.deviceId)', 'count')
      .getRawOne();

    // Calculate average duration with filters
    queryBuilder = this.sessionRepository.createQueryBuilder('session');
    queryBuilder = this.helperService.applyFilters(queryBuilder, filters);
    const avgDuration = await queryBuilder
      .select('AVG(session.duration)', 'avg')
      .where('session.duration IS NOT NULL')
      .getRawOne();

    return {
      totalSessions,
      activeDevices: parseInt(activeDevicesResult.count) || 0,
      avgSessionDuration: this.helperService.formatDuration(
        avgDuration.avg || 0,
      ),
    };
  }
}
