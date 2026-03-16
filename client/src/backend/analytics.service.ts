import api from './api.service';

// Types matching backend DTOs
export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  therapistPhoneId?: string;
  deviceId?: string;
  patientId?: string;
  month?: string;
  limit?: number;
}

export interface DashboardStats {
  sessionsToday: number;
  activeDevices: number;
  totalPatients: number;
  avgSessionDuration: string;
}

export interface AnalyticsStats {
  totalSessions: number;
  activeDevices: number;
  avgSessionDuration: string;
}

export interface SessionDataPoint {
  date: string;
  count: number;
}

export interface SessionsOverTimeData {
  data: SessionDataPoint[];
}

export interface DeviceUsageItem {
  deviceId: string;
  deviceName: string;
  usagePercentage: number;
  sessionCount: number;
}

export interface DeviceUsageData {
  devices: DeviceUsageItem[];
}

export interface StimuliBreakdown {
  visual: number;
  audio: number;
  tactile: number;
}

export interface RecentSession {
  id: string;
  sessionId: string;
  deviceId: string;
  deviceName: string;
  therapistPhoneId: string;
  therapistName: string;
  patientId?: string;
  patientName?: string;
  stimuli: string[];
  timestamp: string;
  duration: string;
  status: string;
}

export interface DurationBucket {
  range: string;
  count: number;
}

export interface SessionDurationDistribution {
  buckets: DurationBucket[];
}

export interface TherapistActivityItem {
  therapistPhoneId: string;
  displayName: string;
  sessionCount: number;
}

export interface TherapistActivityData {
  therapists: TherapistActivityItem[];
}

// Build query string from filters
const buildQueryString = (filters?: AnalyticsFilters): string => {
  if (!filters) return '';
  
  const params = new URLSearchParams();
  
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.therapistPhoneId) params.append('therapistPhoneId', filters.therapistPhoneId);
  if (filters.deviceId) params.append('deviceId', filters.deviceId);
  if (filters.patientId) params.append('patientId', filters.patientId);
  if (filters.month) params.append('month', filters.month);
  if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

export const analyticsService = {
  // Dashboard statistics (always today)
  getDashboardStats: () => 
    api.get<DashboardStats>('/analytics/dashboard-stats'),

  // Analytics statistics (filterable)
  getAnalyticsStats: (filters?: AnalyticsFilters) =>
    api.get<AnalyticsStats>(`/analytics/analytics-stats${buildQueryString(filters)}`),

  // Sessions over time chart data
  getSessionsOverTime: (filters?: AnalyticsFilters) =>
    api.get<SessionsOverTimeData>(`/analytics/sessions-over-time${buildQueryString(filters)}`),

  // Device usage statistics
  getDeviceUsage: (filters?: AnalyticsFilters) =>
    api.get<DeviceUsageData>(`/analytics/device-usage${buildQueryString(filters)}`),

  // Stimuli breakdown percentages
  getStimuliBreakdown: (filters?: AnalyticsFilters) =>
    api.get<StimuliBreakdown>(`/analytics/stimuli-breakdown${buildQueryString(filters)}`),

  // Recent sessions list
  getRecentSessions: (filters?: AnalyticsFilters) =>
    api.get<RecentSession[]>(`/analytics/recent-sessions${buildQueryString(filters)}`),

  // Session duration distribution
  getSessionDurationDistribution: (filters?: AnalyticsFilters) =>
    api.get<SessionDurationDistribution>(`/analytics/session-duration-distribution${buildQueryString(filters)}`),

  // Therapist activity statistics
  getTherapistActivity: (filters?: AnalyticsFilters) =>
    api.get<TherapistActivityData>(`/analytics/therapist-activity${buildQueryString(filters)}`),
};
