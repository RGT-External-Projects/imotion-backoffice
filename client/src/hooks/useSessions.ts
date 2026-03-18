import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService, type Session, type SessionQueryParams } from '@/backend/session.service';

// Query keys
export const sessionKeys = {
  all: ['sessions'] as const,
  list: (params?: SessionQueryParams) => ['sessions', 'list', params] as const,
  detail: (id: string) => ['sessions', id] as const,
  byTherapist: (therapistId: string) => ['sessions', 'therapist', therapistId] as const,
};

// Get all sessions with pagination and filtering
export const useSessions = (params?: SessionQueryParams) => {
  return useQuery({
    queryKey: sessionKeys.list(params),
    queryFn: async () => {
      const response = await sessionService.getAll(params);
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


// Delete session mutation
export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await sessionService.delete(id);
    },
    onSuccess: () => {
      // Invalidate all session list queries
      queryClient.invalidateQueries({ queryKey: ['sessions', 'list'] });
    },
  });
};
