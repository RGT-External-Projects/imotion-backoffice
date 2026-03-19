import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deviceService, type DeviceQueryParams } from '@/backend/device.service';

// Query keys
export const deviceKeys = {
  all: ['devices'] as const,
  paginated: (filters?: DeviceQueryParams) => ['devices', 'paginated', filters] as const,
  detail: (id: string) => ['devices', id] as const,
  byTherapist: (therapistId: string) => ['devices', 'therapist', therapistId] as const,
};

// Get all devices (legacy - without pagination)
export const useAllDevices = () => {
  return useQuery({
    queryKey: deviceKeys.all,
    queryFn: async () => {
      const response = await deviceService.getAll();
      return response.data;
    },
  });
};

// Get devices with pagination and filters
export const useDevices = (filters?: DeviceQueryParams) => {
  return useQuery({
    queryKey: deviceKeys.paginated(filters),
    queryFn: async () => {
      const response = await deviceService.getAllPaginated(filters);
      return response.data;
    },
  });
};

// Get single device by ID (basic info)
export const useDevice = (id: string) => {
  return useQuery({
    queryKey: deviceKeys.detail(id),
    queryFn: async () => {
      const response = await deviceService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Get device details with all related data (sessions, activity logs, therapist phones, statistics)
export const useDeviceDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: deviceKeys.detail(id!),
    queryFn: async () => {
      const response = await deviceService.getById(id!);
      return response.data;
    },
    enabled: !!id,
  });
};

// Get devices by therapist
export const useDevicesByTherapist = (therapistId: string) => {
  return useQuery({
    queryKey: deviceKeys.byTherapist(therapistId),
    queryFn: async () => {
      const response = await deviceService.getByTherapist(therapistId);
      return response.data;
    },
    enabled: !!therapistId,
  });
};

// Create device mutation
export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { deviceId: string; therapistId: string }) => {
      const response = await deviceService.create(data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: deviceKeys.byTherapist(variables.therapistId) 
      });
    },
  });
};

// Delete device mutation
export const useDeleteDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deviceService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
    },
  });
};
