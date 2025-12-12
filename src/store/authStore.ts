/**
 * MMA Universe - Auth Store (Zustand)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/api';
import type { User } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasSeenOnboarding: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (token: string | null, refreshToken?: string | null) => void;
  setOnboardingComplete: () => void;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

// =============================================================================
// AUTH STORE
// =============================================================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      hasSeenOnboarding: false,

      // Actions
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setTokens: (token, refreshToken) => {
        api.setToken(token);
        set({ token, refreshToken: refreshToken ?? get().refreshToken });
      },

      setOnboardingComplete: () => {
        set({ hasSeenOnboarding: true });
      },

      login: (user, token, refreshToken) => {
        api.setToken(token);
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        api.setToken(null);
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (data) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...data } });
        }
      },
    }),
    {
      name: 'mma-universe-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
      onRehydrateStorage: () => (state) => {
        // Restore token to API client after rehydration
        if (state?.token) {
          api.setToken(state.token);
        }
      },
    }
  )
);

export default useAuthStore;
