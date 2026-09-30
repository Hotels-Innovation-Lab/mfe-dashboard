import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

/**
 * Mock auth. Replace `login` with a call to your identity provider
 * (OIDC/OAuth2 PKCE, etc.) — consumers only depend on `user` and `token`.
 */
async function mockAuthenticate(email: string, password: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (!email || !password) throw new Error('Email and password are required');

  const name = email.split('@')[0] ?? 'user';
  const user: User = { id: crypto.randomUUID(), name, email, roles: ['viewer'] };
  const payload = btoa(JSON.stringify({ sub: user.id, email, exp: Date.now() / 1000 + 3600 }));
  return { user, token: `mock.${payload}.signature` };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email, password) => {
        const { user, token } = await mockAuthenticate(email, password);
        set({ user, token });
      },
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'mfe-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ user, token }) => ({ user, token }),
    },
  ),
);

/** Non-React accessor, e.g. for fetch wrappers. */
export const getAccessToken = () => useAuthStore.getState().token;
