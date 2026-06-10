import type { StateCreator } from 'zustand'
import type { StoreProps } from '../../../../store/store'
import type { User } from '../types/user-types'
import type {
  AuthSignInCredentials,
  AuthSignUpCredentials,
  ResetPasswordCredentials,
} from '../types/auth-types'

export interface AuthenticationProps {
  user: User | null;
}
export interface AuthenticationActions {
  setUser: (user: User) => void;
  clearUser: () => void;
}
export type AuthenticationSlice = AuthenticationProps & AuthenticationActions

export const createAuthenticationSlice: StateCreator<
  StoreProps,
  [],
  [],
  AuthenticationSlice
> = (set, get) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    clearUser: () => set({ user: null }),
})
