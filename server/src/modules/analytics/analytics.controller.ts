import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsStatsService } from './services/analytics-stats.service';
import { AnalyticsChartsService } from './services/analytics-charts.service';
import { AnalyticsHelperService } from './services/analytics-helper.service';
import { SessionService } from '../session/session.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { DashboardStatsResponseDto } from './dto/response/dashboard-stats.response.dto';
import { AnalyticsStatsResponseDto } from './dto/response/analytics-stats.response.dto';
import { SessionsOverTimeResponseDto } from './dto/response/sessions-over-time.response.dto';
import { DeviceUsageResponseDto } from './dto/response/device-usage.response.dto';
import { StimuliBreakdownResponseDto } from './dto/response/stimuli-breakdown.response.dto';
import { SessionDurationDistributionResponseDto } from './dto/response/session-duration-distribution.response.dto';
import { TherapistActivityResponseDto } from './dto/response/therapist-activity.response.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly statsService: AnalyticsStatsService,
    private readonly chartsService: AnalyticsChartsService,
    private readonly helperService: AnalyticsHelperService,
    private readonly sessionService: SessionService,
  ) {}

  @Get('dashboard-stats')
  @ApiOperation({
    summary: 'Get dashboard statistics',
    description:
      'Returns statistics for Dashboard page - always shows today\'s data. Includes sessions today, active devices, total patients, and average session duration.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
    type: DashboardStatsResponseDto,
  })
  getDashboardStats(): Promise<DashboardStatsResponseDto> {
    return this.statsService.getDashboardStats();
  }

  @Get('analytics-stats')
  @ApiOperation({
    summary: 'Get analytics statistics',
    description:
      'Returns filterable statistics for Analytics page stat cards. Supports filtering by date range, therapist, and device.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter start date (ISO 8601)',
    example: '2026-10-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter end date (ISO 8601)',
    example: '2026-10-31',
  })
  @ApiQuery({
    name: 'therapistPhoneId',
    required: false,
    description: 'Filter by therapist phone UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'deviceId',
    required: false,
    description: 'Filter by device UUID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics statistics retrieved successfully',
    type: AnalyticsStatsResponseDto,
  })
  getAnalyticsStats(
    @Query() filters: AnalyticsQueryDto,
  ): Promise<AnalyticsStatsResponseDto> {
    return this.statsService.getAnalyticsStats(filters);
  }

  @Get('sessions-over-time')
  @ApiOperation({
    summary: 'Get sessions over time data',
    description:
      'Returns session counts grouped by date. Supports month filter or custom date range. Used by both Dashboard and Analytics pages.',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Filter by month name',
    example: 'october',
    enum: [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ],
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Alternative to month - custom start date',
    example: '2026-10-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Alternative to month - custom end date',
    example: '2026-10-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Sessions over time data retrieved successfully',
    type: SessionsOverTimeResponseDto,
  })
  getSessionsOverTime(
    @Query() filters: AnalyticsQueryDto,
  ): Promise<SessionsOverTimeResponseDto> {
    return this.chartsService.getSessionsOverTime(filters);
  }

  @Get('device-usage')
  @ApiOperation({
    summary: 'Get device usage statistics',
    description:
      'Returns top devices by session count with usage percentages. Supports limit filter to show top 5, 10, or all devices.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of devices to return',
    example: 5,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Device usage statistics retrieved successfully',
    type: DeviceUsageResponseDto,
  })
  getDeviceUsage(
    @Query() filters: AnalyticsQueryDto,
  ): Promise<DeviceUsageResponseDto> {
    return this.chartsService.getDeviceUsage(filters);
  }

  @Get('stimuli-breakdown')
  @ApiOperation({
    summary: 'Get stimuli breakdown',
    description:
      'Returns percentage breakdown of stimuli types (visual, audio, vibration) used in sessions. Extracts stimuli from session initialSettings.',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Filter by month',
    example: 'october',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Or use custom date range - start date',
    example: '2026-10-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Or use custom date range - end date',
    example: '2026-10-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Stimuli breakdown retrieved successfully',
    type: StimuliBreakdownResponseDto,
  })
  getStimuliBreakdown(
    @Query() filters: AnalyticsQueryDto,
  ): Promise<StimuliBreakdownResponseDto> {
    return this.chartsService.getStimuliBreakdown(filters);
  }

  @Get('recent-sessions')
  @ApiOperation({
    summary: 'Get recent sessions',
    description:
      'Returns most recent sessions with stimuli information extracted from initialSettings. Used by Dashboard page.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of sessions to return',
    example: 5,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Recent sessions retrieved successfully',
  })
  async getRecentSessions(@Query() filters: AnalyticsQueryDto) {
    // Get all sessions with relationships using existing SessionService
    const allSessions = await this.sessionService.findAll();
    
    // Limit results
    const limit = filters.limit || 5;
    const recentSessions = allSessions.slice(0, limit);
    
    // Transform to include extracted stimuli
    return recentSessions.map((session) => ({
      id: session.id,
      sessionId: session.id.substring(0, 8).toUpperCase(), // Short ID for display
      deviceId: session.deviceId,
      deviceName: session.device?.deviceName || 'Unknown Device',
      therapistPhoneId: session.therapistPhoneId,
      therapistName: session.therapistPhone?.phoneNumber || 'Unknown',
      patientId: session.patientId,
      patientName: session.patient ? session.patient.name : 'Unknown',
      stimuli: this.helperService.extractStimuliTypes(session.initialSettings),
      timestamp: session.sessionTimestamp,
      duration: session.duration ? this.helperService.formatDuration(session.duration) : '—',
      status: session.status,
    }));
  }

  @Get('session-duration-distribution')
  @ApiOperation({
    summary: 'Get session duration distribution',
    description:
      'Returns distribution of session durations grouped into buckets (0-5min, 5-10min, etc.). Used by Analytics page.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter start date',
    example: '2026-10-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter end date',
    example: '2026-10-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Session duration distribution retrieved successfully',
    type: SessionDurationDistributionResponseDto,
  })
  getSessionDurationDistribution(
    @Query() filters: AnalyticsQueryDto,
  ): Promise<SessionDurationDistributionResponseDto> {
    return this.chartsService.getSessionDurationDistribution(filters);
  }

  @Get('therapist-activity')
  @ApiOperation({
    summary: 'Get therapist activity statistics',
    description:
      'Returns session counts per therapist phone. Used by Analytics page to show therapist performance.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter start date',
    example: '2026-10-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter end date',
    example: '2026-10-31',
  })
  @ApiQuery({
    name: 'deviceId',
    required: false,
    description: 'Filter by device (to see therapist activity on specific device)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: 200,
    description: 'Therapist activity retrieved successfully',
    type: TherapistActivityResponseDto,
  })
  getTherapistActivity(
    @Query() filters: AnalyticsQueryDto,
  ): Promise<TherapistActivityResponseDto> {
    return this.chartsService.getTherapistActivity(filters);
  }
}
