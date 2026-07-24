import api from './api';

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { name: string; email: string; password: string; phone?: string; }

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  data: { user: User; token: string };
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', payload),

  me: () =>
    api.get<{ success: boolean; data: User & { healthProfile: unknown } }>('/auth/me'),

  logout: () => {
    localStorage.removeItem('nutriflow_token');
    localStorage.removeItem('nutriflow_user');
  },

  saveSession: (token: string, user: User) => {
    localStorage.setItem('nutriflow_token', token);
    localStorage.setItem('nutriflow_user', JSON.stringify(user));
  },

  getStoredUser: (): User | null => {
    const raw = localStorage.getItem('nutriflow_user');
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('nutriflow_token');
  },
};
