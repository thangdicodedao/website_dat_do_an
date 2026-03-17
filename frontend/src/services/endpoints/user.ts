import { mockApi } from '../api';
import { User, AdminStats } from '../../types';
import { users as allUsers, orders } from '../../data';

export const userAPI = {
  getUsers: async (): Promise<User[]> => {
    await mockApi.delay(400);
    return [...allUsers];
  },

  getUserById: async (id: string): Promise<User> => {
    await mockApi.delay(300);

    const user = allUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    return user;
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    await mockApi.delay(500);

    const index = allUsers.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Người dùng không tồn tại');
    }

    allUsers[index] = { ...allUsers[index], ...updates };
    return allUsers[index];
  },

  deleteUser: async (id: string): Promise<void> => {
    await mockApi.delay(400);

    const index = allUsers.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Người dùng không tồn tại');
    }

    allUsers.splice(index, 1);
  },

  getAdminStats: async (): Promise<AdminStats> => {
    await mockApi.delay(600);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

    return {
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      todayRevenue,
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      totalUsers: allUsers.length,
      newUsersToday: Math.floor(Math.random() * 5) + 1,
      totalProducts: 16,
      lowStockProducts: 2,
    };
  },

  toggleUserRole: async (userId: string): Promise<User> => {
    await mockApi.delay(400);

    const user = allUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    user.role = user.role === 'admin' ? 'user' : 'admin';
    return user;
  },
};
