import api from '../api';
import { User, AdminStats } from '../../types';

export const userAPI = {
  createUser: async (data: { email: string; password: string; name: string; phone: string; role?: 'user' | 'admin'; isVerified?: boolean; avatar?: string; address?: string }): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data.data.user;
  },

  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data.data.users;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data.user;
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, updates);
    return response.data.data.user;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getAdminStats: async (): Promise<AdminStats> => {
    const response = await api.get('/users/stats');
    return response.data.data;
  },

  toggleUserRole: async (userId: string): Promise<User> => {
    const response = await api.patch(`/users/${userId}/role`);
    return response.data.data.user;
  },

  updateProfile: async (data: { name?: string; phone?: string; avatar?: string; address?: string }): Promise<User> => {
    const response = await api.put('/users/profile', data);
    const user = response.data.data.user;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },
};
