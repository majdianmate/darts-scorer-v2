import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { User } from '../types/user-types'
import {
  signUpWithCredentials,
  signInWithCredentials,
  signOutService,
  resetPasswordService,
  deleteAccountService,
  signInOrSignUpWithGoogle,
  initAuthSync,
} from '../service/auth-service'

export const useAuthentication = () => {
  const queryClient = useQueryClient()
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const { data: user = null } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => queryClient.getQueryData<User | null>(['user']) ?? null,
    initialData: null,
    staleTime: Infinity,
  })

  useEffect(() => {
    const unsubscribe = initAuthSync((nextUser) => {
      queryClient.setQueryData(['user'], nextUser)
      setIsAuthLoading(false)
    })

    return () => unsubscribe()
  }, [queryClient])

  const signUpWithCredentialsMutation = useMutation({
    mutationFn: signUpWithCredentials,
    onSuccess: (createdUser) => {
      queryClient.setQueryData(['user'], createdUser)
      toast.success('Signed up successfully')
    },
    onError: () => {
      toast.error('Failed to sign up')
    },
  })

  const signInOrSignUpWithGoogleMutation = useMutation({
    mutationFn: signInOrSignUpWithGoogle,
    onSuccess: () => {
      toast.success('Signed up with Google successfully')
    },
    onError: () => {
      toast.error('Failed to sign up with Google')
    },
  })

  const signInWithCredentialsMutation = useMutation({
    mutationFn: signInWithCredentials,
    onSuccess: (signedInUser) => {
      queryClient.setQueryData(['user'], signedInUser)
      toast.success('Signed in successfully')
    },
    onError: () => {
      toast.error('Failed to sign in')
    },
  })

  const signOutMutation = useMutation({
    mutationFn: signOutService,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null)
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
      queryClient.setQueryData(['user'], null)
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
      isAuthLoading ||
      signUpWithCredentialsMutation.isPending ||
      signInOrSignUpWithGoogleMutation.isPending ||
      signInWithCredentialsMutation.isPending ||
      signOutMutation.isPending ||
      resetPasswordMutation.isPending ||
      deleteAccountMutation.isPending
  }
}
