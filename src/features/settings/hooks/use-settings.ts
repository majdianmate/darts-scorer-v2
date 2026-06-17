import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuthentication } from '#/features/authentication/hooks/use-authentication'
import type { User } from '#/features/authentication/types/user-types'
import {
  updateUserProfile,
  uploadProfileImage,
} from '../service/settings-service'

type UpdateUserSettingsInput = Partial<
  Pick<User, 'image' | 'displayName' | 'name' | 'email'>
>

export const useSettings = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthentication()

  const updateUserSettingsMutation = useMutation({
    mutationFn: async (updates: UpdateUserSettingsInput) => {
      if (!user) throw new Error('Not authenticated')
      return updateUserProfile(user.id, updates)
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], updatedUser)
      toast.success('Settings updated successfully')
    },
    onError: () => {
      toast.error('Failed to update settings')
    },
  })

  const uploadProfileImageMutation = useMutation({
    mutationFn: uploadProfileImage,
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload image',
      )
    },
  })

  return {
    user,
    updateUserSettings: updateUserSettingsMutation.mutateAsync,
    uploadProfileImage: uploadProfileImageMutation.mutateAsync,
    isLoading:
      updateUserSettingsMutation.isPending ||
      uploadProfileImageMutation.isPending,
  }
}
