import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

localStorage.removeItem('mintech_access_token');
localStorage.removeItem('mintech_user');

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,

  login: (token, user) => set({
    token,
    user,
    isAuthenticated: true,
    isAdmin: user.role === 'ADMIN',
  }),

  logout: () => set({
    token: null,
    user: null,
    isAuthenticated: false,
    isAdmin: false,
  }),

  updateUser: (updated) =>
    set((state) => {
      if (!state.user) return state;
      const user = { ...state.user, ...updated };
      return { user, isAdmin: user.role === 'ADMIN' };
    }),
}));
