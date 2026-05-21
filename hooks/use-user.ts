import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

import {
  deleteAccountService,
  getOrCreateUserData,
  loginWithEmailService,
  loginWithGoogleService,
  logoutService,
  registerWithEmailService,
  resetPasswordService,
  subscribeToAuthChanges,
} from "../services/user-service";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { AuthCredentials, User } from "../types/user-types";

const USER_QUERY_KEY = ["user"] as const;

// Az auth listener-t csak egyszer szeretnénk regisztrálni az app életciklusában,
// függetlenül attól, hogy hány komponens használja a useUser hookot.
let authListenerRegistered = false;

export const useUser = () => {
  const queryClient = useQueryClient();

  // Folyamatos auth state subscribe — frissíti a query cache-t.
  useEffect(() => {
    if (authListenerRegistered) return;
    authListenerRegistered = true;

    subscribeToAuthChanges((user) => {
      queryClient.setQueryData<User | null>(USER_QUERY_KEY, user);
    });
  }, [queryClient]);

  const userQuery = useQuery<User | null>({
    queryKey: USER_QUERY_KEY,
    // Az első auth callback-ig várunk; a folyamatos frissítést a fenti effect intézi.
    queryFn: () =>
      new Promise<User | null>((resolve) => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
          unsub();
          if (!firebaseUser) {
            resolve(null);
            return;
          }
          const userData = await getOrCreateUserData(firebaseUser);
          resolve(userData);
        });
      }),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });

  const loginWithGoogle = useMutation({
    mutationFn: loginWithGoogleService,
    onSuccess: () => toast.success("Successfully logged in!"),
    onError: (error: Error) =>
      toast.error("Google login error: " + error.message),
  });

  const registerWithEmail = useMutation({
    mutationFn: (params: AuthCredentials & { name: string }) =>
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
    onSuccess: () => toast.success("Successfully logged in!"),
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
    user: userQuery.data ?? null,
    isUserLoading: userQuery.isLoading,
    isUserError: userQuery.isError,

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