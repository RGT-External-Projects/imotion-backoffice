import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  userService, 
  type User, 
  type InviteUserDto, 
  type UpdateUserDto,
  type UpdateProfileDto 
} from '@/backend/user.service';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => ['users', id] as const,
  profile: ['users', 'profile'] as const,
};

/**
 * Get all users (for user management)
 * Used by: Settings/UserManagementTab
 */
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: async () => {
      const response = await userService.getAll();
      return response.data;
    },
  });
};

/**
 * Get single user by ID
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const response = await userService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Get current user profile
 * Used by: Settings/ProfileTab, Layout components
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.profile,
    queryFn: async () => {
      const response = await userService.getProfile();
      return response.data;
    },
  });
};

/**
 * Invite new user mutation
 * Used by: Settings/InviteUserModal
 */
export const useInviteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InviteUserDto) => {
      const response = await userService.inviteUser(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

/**
 * Update user mutation (for admins)
 * Used by: Settings/UserManagementTab
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserDto }) => {
      const response = await userService.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
};

/**
 * Update own profile mutation
 * Used by: Settings/ProfileTab
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileDto) => {
      const response = await userService.updateProfile(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
    },
  });
};

/**
 * Delete user mutation
 * Used by: Settings/UserManagementTab
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await userService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Re-export types
export type { User, InviteUserDto, UpdateUserDto, UpdateProfileDto };
