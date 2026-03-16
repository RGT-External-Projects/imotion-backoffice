import { useQuery } from '@tanstack/react-query';
import { 
  analyticsService, 
  type AnalyticsFilters,
  type DashboardStats,
  type AnalyticsStats,
  type SessionsOverTimeData,
  type DeviceUsageData,
  type StimuliBreakdown,
  type RecentSession,
  type SessionDurationDistribution,
  type TherapistActivityData,
} from '@/backend/analytics.service';

// Query keys for cache management
export const analyticsKeys = {
  dashboardStats: ['analytics', 'dashboard-stats'] as const,
  analyticsStats: (filters?: AnalyticsFilters) => ['analytics', 'analytics-stats', filters] as const,
  sessionsOverTime: (filters?: AnalyticsFilters) => ['analytics', 'sessions-over-time', filters] as const,
  deviceUsage: (filters?: AnalyticsFilters) => ['analytics', 'device-usage', filters] as const,
  stimuliBreakdown: (filters?: AnalyticsFilters) => ['analytics', 'stimuli-breakdown', filters] as const,
  recentSessions: (filters?: AnalyticsFilters) => ['analytics', 'recent-sessions', filters] as const,
  sessionDurationDistribution: (filters?: AnalyticsFilters) => ['analytics', 'session-duration-distribution', filters] as const,
  therapistActivity: (filters?: AnalyticsFilters) => ['analytics', 'therapist-activity', filters] as const,
};

/**
 * Get dashboard statistics (always today's data)
 * Used by: Dashboard page stat cards
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: analyticsKeys.dashboardStats,
    queryFn: async () => {
      const response = await analyticsService.getDashboardStats();
      return response.data;
    },
  });
};

/**
 * Get analytics statistics (filterable)
 * Used by: Analytics page stat cards
 */
export const useAnalyticsStats = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: analyticsKeys.analyticsStats(filters),
    queryFn: async () => {
      const response = await analyticsService.getAnalyticsStats(filters);
      return response.data;
    },
  });
};

/**
 * Get sessions over time chart data
 * Used by: Dashboard & Analytics pages - SessionOverTimeChart
 */
export const useSessionsOverTime = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: analyticsKeys.sessionsOverTime(filters),
    queryFn: async () => {
      const response = await analyticsService.getSessionsOverTime(filters);
      return response.data;
    },
  });
};

/**
 * Get device usage statistics
 * Used by: Dashboard & Analytics pages - DeviceUsageChart
 */
export const useDeviceUsage = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: analyticsKeys.deviceUsage(filters),
    queryFn: async () => {
      const response = await analyticsService.getDeviceUsage(filters);
      return response.data;
    },
  });
};

/**
 * Get stimuli breakdown percentages
 * Used by: Dashboard & Analytics pages - StimuliBreakdownChart
 */
export const useStimuliBreakdown = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: analyticsKeys.stimuliBreakdown(filters),
    queryFn: async () => {
      const response = await analyticsService.getStimuliBreakdown(filters);
      return response.data;
    },
  });
};

/**
 * Get recent sessions list
 * Used by: Dashboard page - RecentSessionsTable
 */
export const useRecentSessions = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: analyticsKeys.recentSessions(filters),
    queryFn: async () => {
      const response = await analyticsService.getRecentSessions(filters);
      return response.data;
    },
  });
};

/**
 * Get session duration distribution
 * Used by: Analytics page - SessionDurationChart
 */
export const useSessionDurationDistribution = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: analyticsKeys.sessionDurationDistribution(filters),
    queryFn: async () => {
      const response = await analyticsService.getSessionDurationDistribution(filters);
      return response.data;
    },
  });
};

/**
 * Get therapist activity statistics
 * Used by: Analytics page - TherapistActivityChart
 */
export const useTherapistActivity = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: analyticsKeys.therapistActivity(filters),
    queryFn: async () => {
      const response = await analyticsService.getTherapistActivity(filters);
      return response.data;
    },
  });
};

// Re-export types for convenience
export type {
  AnalyticsFilters,
  DashboardStats,
  AnalyticsStats,
  SessionsOverTimeData,
  DeviceUsageData,
  StimuliBreakdown,
  RecentSession,
  SessionDurationDistribution,
  TherapistActivityData,
};
