import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService, type Session } from '@/backend/session.service';

// Query keys
export const sessionKeys = {
  all: ['sessions'] as const,
  detail: (id: string) => ['sessions', id] as const,
  byTherapist: (therapistId: string) => ['sessions', 'therapist', therapistId] as const,
};

// Get all sessions
export const useSessions = () => {
  return useQuery({
    queryKey: sessionKeys.all,
    queryFn: async () => {
      const response = await sessionService.getAll();
      return response.data;
    },
  });
};

// Get single session by ID
export const useSession = (id: string) => {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: async () => {
      const response = await sessionService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Get sessions by therapist
export const useSessionsByTherapist = (therapistId: string) => {
  return useQuery({
    queryKey: sessionKeys.byTherapist(therapistId),
    queryFn: async () => {
      const response = await sessionService.getByTherapist(therapistId);
      return response.data;
    },
    enabled: !!therapistId,
  });
};

// Create session mutation
export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await sessionService.create(data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: sessionKeys.byTherapist(variables.therapistId) 
      });
    },
  });
};

// Delete session mutation
export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await sessionService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
};
