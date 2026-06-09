import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { initAuthSync, resolveAuthUser } from "@/lib/auth";

const AuthReadyContext = createContext(false);

export function useAuthReady() {
  return useContext(AuthReadyContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuthSync(queryClient);

    void resolveAuthUser(queryClient).finally(() => {
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, [queryClient]);

  return (
    <AuthReadyContext.Provider value={isAuthReady}>
      {children}
    </AuthReadyContext.Provider>
  );
}
