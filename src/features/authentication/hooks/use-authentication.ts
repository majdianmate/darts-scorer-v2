import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useStore } from '../../../../store/store'
import type { User } from '../types/user-types'
import {
  signUpWithCredentials,
  signInWithCredentials,
  signOutService,
  resetPasswordService,
  deleteAccountService,
  signInOrSignUpWithGoogle,
} from '../service/auth-service'

export const useAuthentication = () => {
  const queryClient = useQueryClient()

  const user = useStore((state) => state.user)
  const setUser = useStore((state) => state.setUser)
  const clearUser = useStore((state) => state.clearUser)

  const syncUser = (user: User) => {
    setUser(user)
    queryClient.setQueryData(['user'], user)
  }

  const clearUserSession = () => {
    clearUser()
    queryClient.setQueryData(['user'], null)
  }

  const signUpWithCredentialsMutation = useMutation({
    mutationFn: signUpWithCredentials,
    onSuccess: (user) => {
      syncUser(user)
      toast.success('Signed up successfully')
    },
    onError: () => {
      toast.error('Failed to sign up')
    },
  })

  const signInOrSignUpWithGoogleMutation = useMutation({
    mutationFn: signInOrSignUpWithGoogle,
    onSuccess: (user) => {
      syncUser(user)
      toast.success('Signed up with Google successfully')
    },
    onError: () => {
      toast.error('Failed to sign up with Google')
    },
  })

  const signInWithCredentialsMutation = useMutation({
    mutationFn: signInWithCredentials,
    onSuccess: (user) => {
      syncUser(user)
      toast.success('Signed in successfully')
    },
    onError: () => {
      toast.error('Failed to sign in')
    },
  })

  const signOutMutation = useMutation({
    mutationFn: signOutService,
    onSuccess: () => {
      clearUserSession()
      toast.success('Signed out successfully')
    },
    onError: () => {
      toast.error('Failed to sign out')
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: resetPasswordService,
    onSuccess: () => {
      toast.success('Reset password successfully')
    },
    onError: () => {
      toast.error('Failed to reset password')
    },
  })

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccountService,
    onSuccess: () => {
      clearUserSession()
      toast.success('Deleted account successfully')
    },
    onError: () => {
      toast.error('Failed to delete account')
    },
  })

  return {
    user,
    signUpWithCredentials: signUpWithCredentialsMutation.mutateAsync,
    signInOrSignUpWithGoogle: signInOrSignUpWithGoogleMutation.mutateAsync,
    signInWithCredentials: signInWithCredentialsMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    deleteAccount: deleteAccountMutation.mutateAsync,

    isLoading: 
      signUpWithCredentialsMutation.isPending ||
      signInOrSignUpWithGoogleMutation.isPending ||
      signInWithCredentialsMutation.isPending ||
      signOutMutation.isPending ||
      resetPasswordMutation.isPending ||
      deleteAccountMutation.isPending
  }
}
