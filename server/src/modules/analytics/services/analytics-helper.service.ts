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
   * Extract stimuli types from session settings JSON.
   *
   * Frontend currently treats a stimulus as "used" if either:
   * - the settings block exists (visual/audio/vibration present), or
   * - its feedback/enabled flag is true.
   *
   * The Sessions page uses a simple presence check:
   *   if (settings?.visual) stimuli.push('Visual');
   *   if (settings?.audio) stimuli.push('Audio');
   *   if (settings?.vibration || settings?.tactile) stimuli.push('Vibration');
   *
   * We mirror that behaviour here, while also honouring optional
   * `enabled` / `feedback` flags when present so older/newer payloads
   * both work.
   */
  extractStimuliTypes(initialSettings: any): string[] {
    const stimuli: string[] = [];

    if (!initialSettings) return stimuli;

    const isVisualEnabled = !!initialSettings.visual && (
      initialSettings.visual.enabled === true ||
      initialSettings.visual.feedback === true ||
      // Fallback: if block exists but no explicit flag, treat as used
      (initialSettings.visual.enabled === undefined && initialSettings.visual.feedback === undefined)
    );

    if (isVisualEnabled) {
      stimuli.push('Visual');
    }

    const isAudioEnabled = !!initialSettings.audio && (
      initialSettings.audio.enabled === true ||
      initialSettings.audio.feedback === true ||
      (initialSettings.audio.enabled === undefined && initialSettings.audio.feedback === undefined)
    );

    if (isAudioEnabled) {
      stimuli.push('Audio');
    }

    const vibrationBlock = initialSettings.vibration || initialSettings.tactile;
    const isVibrationEnabled = !!vibrationBlock && (
      vibrationBlock.enabled === true ||
      vibrationBlock.feedback === true ||
      (vibrationBlock.enabled === undefined && vibrationBlock.feedback === undefined)
    );

    if (isVibrationEnabled) {
      // Fallback for old data with "tactile" still maps to "Vibration" label
      stimuli.push('Vibration');
    }

    return stimuli;
  }
}
