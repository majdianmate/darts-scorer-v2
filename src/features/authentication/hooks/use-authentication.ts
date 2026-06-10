import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useStore } from '../../../../store/store'
import type {
  AuthSignInCredentials,
  AuthSignUpCredentials,
  ResetPasswordCredentials,
} from '../types/auth-types'
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

  const signUpWithCredentialsMutation = useMutation({
    mutationFn: signUpWithCredentials,
    onSuccess: (user) => {
      setUser(user)
      toast.success('Signed up successfully')
    },
    onError: () => {
      toast.error('Failed to sign up')
    },
  })

  const signInOrSignUpWithGoogleMutation = useMutation({
    mutationFn: signInOrSignUpWithGoogle,
    onSuccess: (user) => {
      setUser(user)
      toast.success('Signed up with Google successfully')
    },
    onError: () => {
      toast.error('Failed to sign up with Google')
    },
  })

  const signInWithCredentialsMutation = useMutation({
    mutationFn: signInWithCredentials,
    onSuccess: (user) => {
      setUser(user)
      toast.success('Signed in successfully')
    },
    onError: () => {
      toast.error('Failed to sign in')
    },
  })

  const signOutMutation = useMutation({
    mutationFn: signOutService,
    onSuccess: () => {
      clearUser()
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
      clearUser()
      queryClient.invalidateQueries({ queryKey: ['user'] });
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
