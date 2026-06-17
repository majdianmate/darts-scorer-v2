import { useMutation } from '@tanstack/react-query'
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
  const [user, setUser] = useState<User | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = initAuthSync((nextUser) => {
      setUser(nextUser)
      setIsAuthLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signUpWithCredentialsMutation = useMutation({
    mutationFn: signUpWithCredentials,
    onSuccess: (createdUser) => {
      setUser(createdUser)
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
      setUser(signedInUser)
      toast.success('Signed in successfully')
    },
    onError: () => {
      toast.error('Failed to sign in')
    },
  })

  const signOutMutation = useMutation({
    mutationFn: signOutService,
    onSuccess: () => {
      setUser(null)
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
      setUser(null)
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
