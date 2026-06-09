import { queryOptions } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";
import {
  getOrCreateUserData,
  subscribeToAuthChanges,
} from "../../services/user-service";
import type { User } from "../../types/user-types";

export const USER_QUERY_KEY = ["user"] as const;

export async function fetchAuthUser(): Promise<User | null> {
  if (auth.currentUser) {
    return getOrCreateUserData(auth.currentUser);
  }

  return new Promise<User | null>((resolve) => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      unsub();
      if (!firebaseUser) {
        resolve(null);
        return;
      }
      resolve(await getOrCreateUserData(firebaseUser));
    });
  });
}

export function getUserQueryOptions() {
  return queryOptions({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchAuthUser,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });
}

export async function resolveAuthUser(
  queryClient: QueryClient,
): Promise<User | null> {
  if (typeof window === "undefined") {
    return (await queryClient.ensureQueryData(getUserQueryOptions())) ?? null;
  }

  const cached = queryClient.getQueryData<User | null>(USER_QUERY_KEY);
  if (cached) {
    return cached;
  }

  const user = await fetchAuthUser();
  queryClient.setQueryData(USER_QUERY_KEY, user);
  return user;
}

export async function requireAuth(
  queryClient: QueryClient,
  redirectHref?: string,
) {
  // SSR-en nincs Firebase session — a kliens ellenőrzi hidrátálás után
  if (typeof window === "undefined") {
    return null;
  }

  const user = await resolveAuthUser(queryClient);

  if (!user) {
    throw redirect({
      to: "/sign-in",
      search: redirectHref ? { redirect: redirectHref } : undefined,
    });
  }

  return user;
}

export function initAuthSync(queryClient: QueryClient) {
  return subscribeToAuthChanges((user) => {
    queryClient.setQueryData<User | null>(USER_QUERY_KEY, user);
  });
}
