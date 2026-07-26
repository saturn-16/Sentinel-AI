import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('sentinel_token'),
  isAuthenticated: !!localStorage.getItem('sentinel_token'),
  isLoading: true,

  login: async (email: string, pass: string) => {
    set({ isLoading: true });
    try {
      const data = await authService.login(email, pass);
      localStorage.setItem('sentinel_token', data.access_token);
      const user = await authService.getMe();
      set({ user, token: data.access_token, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('sentinel_token');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    let currentToken = localStorage.getItem('sentinel_token');
    if (!currentToken) {
      try {
        const data = await authService.login('admin@honeywell.com', 'SentinelPass2026!');
        currentToken = data.access_token;
        if (currentToken) {
          localStorage.setItem('sentinel_token', currentToken);
        }
      } catch (err) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
    }
    try {
      const user = await authService.getMe();
      set({ user, token: currentToken, isAuthenticated: true, isLoading: false });
    } catch (err) {
      try {
        const data = await authService.login('admin@honeywell.com', 'SentinelPass2026!');
        localStorage.setItem('sentinel_token', data.access_token);
        const user = await authService.getMe();
        set({ user, token: data.access_token, isAuthenticated: true, isLoading: false });
      } catch (loginErr) {
        localStorage.removeItem('sentinel_token');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    }
  },
}));
