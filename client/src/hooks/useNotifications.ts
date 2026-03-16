import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  notificationService, 
  type Notification, 
  type NotificationSettings,
  type UpdateNotificationSettingsDto 
} from '@/backend/notification.service';

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  settings: ['notifications', 'settings'] as const,
};

/**
 * Get all notifications
 * Used by: Notification bell/dropdown, Notification center
 */
export const useNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: async () => {
      const response = await notificationService.getAll();
      return response.data;
    },
  });
};

/**
 * Get notification settings
 * Used by: Settings/NotificationsTab
 */
export const useNotificationSettings = () => {
  return useQuery({
    queryKey: notificationKeys.settings,
    queryFn: async () => {
      const response = await notificationService.getSettings();
      return response.data;
    },
  });
};

/**
 * Mark notification as read mutation
 */
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await notificationService.markAsRead(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

/**
 * Mark all notifications as read mutation
 */
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await notificationService.markAllAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

/**
 * Delete notification mutation
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await notificationService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

/**
 * Update notification settings mutation
 * Used by: Settings/NotificationsTab
 */
export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateNotificationSettingsDto) => {
      const response = await notificationService.updateSettings(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.settings });
    },
  });
};

// Re-export types
export type { Notification, NotificationSettings, UpdateNotificationSettingsDto };
