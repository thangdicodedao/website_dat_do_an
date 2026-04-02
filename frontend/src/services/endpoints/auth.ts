import api from '../api';
import { User, LoginCredentials, RegisterData, VerifyEmailData, ForgotPasswordData } from '../../types';

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/login', credentials);
    const { user, accessToken, refreshToken } = response.data.data;
    localStorage.setItem('auth_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, token: accessToken };
  },

  register: async (data: RegisterData): Promise<{ user: User; message: string }> => {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  verifyEmail: async (data: VerifyEmailData): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/verify-email', data);
    const { user, accessToken, refreshToken } = response.data.data;
    localStorage.setItem('auth_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, token: accessToken };
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: { email: string; code: string; newPassword: string }): Promise<{ message: string }> => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get('/auth/me');
      const user = response.data.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch {
      return null;
    }
  },

  resendCode: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/resend-code', { email, type: 'verification' });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },
};
