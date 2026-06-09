import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  deleteAccountService,
  loginWithEmailService,
  loginWithGoogleService,
  logoutService,
  registerWithEmailService,
  resetPasswordService,
} from "../services/user-service";
import { useAuthReady } from "@/components/auth-provider";
import {
  fetchAuthUser,
  getUserQueryOptions,
  USER_QUERY_KEY,
} from "@/lib/auth";
import type { AuthCredentials, User } from "../types/user-types";

export const useUser = () => {
  const queryClient = useQueryClient();
  const isAuthReady = useAuthReady();

  const userQuery = useQuery(getUserQueryOptions());

  const user = userQuery.data ?? null;
  const isUserLoading =
    !isAuthReady || userQuery.isLoading || userQuery.isFetching;
  const isAuthenticated = isAuthReady && user !== null;

  const syncUserCache = async () => {
    const userData = await fetchAuthUser();
    queryClient.setQueryData<User | null>(USER_QUERY_KEY, userData);
    return userData;
  };

  const loginWithGoogle = useMutation({
    mutationFn: loginWithGoogleService,
    onSuccess: async () => {
      await syncUserCache();
      toast.success("Successfully logged in!");
    },
    onError: (error: Error) =>
      toast.error("Google login error: " + error.message),
  });

  const registerWithEmail = useMutation({
    mutationFn: (params: AuthCredentials & { name: string; displayName: string }) =>
      registerWithEmailService(params),
    onSuccess: (newUser) => {
      queryClient.setQueryData<User | null>(USER_QUERY_KEY, newUser);
      toast.success("Account created successfully!");
    },
    onError: (error: Error) =>
      toast.error("Registration error: " + error.message),
  });

  const loginWithEmail = useMutation({
    mutationFn: (params: AuthCredentials) => loginWithEmailService(params),
    onSuccess: async () => {
      await syncUserCache();
      toast.success("Successfully logged in!");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const resetPassword = useMutation({
    mutationFn: (email: string) => resetPasswordService(email),
    onSuccess: () => toast.success("Password reset email sent!"),
    onError: (error: Error) => toast.error("Error: " + error.message),
  });

  const logout = useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      queryClient.setQueryData<User | null>(USER_QUERY_KEY, null);
      toast.success("Successfully logged out!");
    },
    onError: (error: Error) => toast.error("Error: " + error.message),
  });

  const deleteAccount = useMutation({
    mutationFn: deleteAccountService,
    onSuccess: () => {
      queryClient.setQueryData<User | null>(USER_QUERY_KEY, null);
      toast.success("Account deleted successfully.");
    },
    onError: (error: Error) =>
      toast.error(
        "Deletion error (you may need to log in again before deleting): " +
          error.message,
      ),
  });

  return {
    user,
    isUserLoading,
    isUserError: userQuery.isError,
    isAuthenticated,

    loginWithGoogle: loginWithGoogle.mutateAsync,
    isLoginWithGoogleLoading: loginWithGoogle.isPending,

    registerWithEmail: registerWithEmail.mutateAsync,
    isRegisterLoading: registerWithEmail.isPending,

    loginWithEmail: loginWithEmail.mutateAsync,
    isLoginLoading: loginWithEmail.isPending,

    resetPassword: resetPassword.mutateAsync,
    isResetPasswordLoading: resetPassword.isPending,

    logout: logout.mutateAsync,
    isLogoutLoading: logout.isPending,

    deleteAccount: deleteAccount.mutateAsync,
    isDeleteAccountLoading: deleteAccount.isPending,
  };
};
