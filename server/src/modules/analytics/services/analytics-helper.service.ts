import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Session } from '../../session/entities/session.entity';
import { AnalyticsQueryDto } from '../dto/analytics-query.dto';

@Injectable()
export class AnalyticsHelperService {
  /**
   * Apply common filters to a session query builder
   */
  applyFilters(
    queryBuilder: SelectQueryBuilder<Session>,
    filters: AnalyticsQueryDto,
  ): SelectQueryBuilder<Session> {
    if (filters.startDate) {
      queryBuilder.andWhere('session.sessionTimestamp >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('session.sessionTimestamp <= :endDate', {
        endDate: filters.endDate,
      });
    }

    if (filters.therapistPhoneId) {
      queryBuilder.andWhere('session.therapistPhoneId = :therapistId', {
        therapistId: filters.therapistPhoneId,
      });
    }

    if (filters.deviceId) {
      queryBuilder.andWhere('session.deviceId = :deviceId', {
        deviceId: filters.deviceId,
      });
    }

    if (filters.patientId) {
      queryBuilder.andWhere('session.patientId = :patientId', {
        patientId: filters.patientId,
      });
    }

    // Handle month filter
    if (filters.month) {
      const monthMap = {
        january: 1,
        february: 2,
        march: 3,
        april: 4,
        may: 5,
        june: 6,
        july: 7,
        august: 8,
        september: 9,
        october: 10,
        november: 11,
        december: 12,
      };

      const monthNum = monthMap[filters.month.toLowerCase()];
      if (monthNum) {
        queryBuilder.andWhere(
          'EXTRACT(MONTH FROM session.sessionTimestamp) = :month',
          { month: monthNum },
        );
      }
    }

    return queryBuilder;
  }

  /**
   * Format seconds into "Xm Ys" format
   */
  formatDuration(seconds: number): string {
    if (!seconds || seconds === 0) return '0s';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }

    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }

    return `${minutes}m ${remainingSeconds}s`;
  }

  /**
   * Get start and end of today
   */
  getTodayRange(): { start: Date; end: Date } {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  /**
   * Extract stimuli types from initialSettings JSON
   * Only count stimuli that are ENABLED, not just present
   */
  extractStimuliTypes(initialSettings: any): string[] {
    const stimuli: string[] = [];

    if (!initialSettings) return stimuli;

    // Check if each stimuli type is ENABLED (not just if property exists)
    if (initialSettings.visual && initialSettings.visual.enabled === true) {
      stimuli.push('Visual');
    }

    if (initialSettings.audio && initialSettings.audio.enabled === true) {
      stimuli.push('Audio');
    }

    if ((initialSettings.vibration && initialSettings.vibration.enabled === true) ||
        (initialSettings.tactile && initialSettings.tactile.enabled === true)) {
      stimuli.push('Vibration'); // Fallback for old data with "tactile"
    }

    return stimuli;
  }
}
