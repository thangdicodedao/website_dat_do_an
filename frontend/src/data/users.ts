import { User } from '../types';

export const users: User[] = [
  {
    id: 'user-001',
    email: 'admin@gmail.com',
    name: 'Admin',
    phone: '0912345678',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    role: 'admin',
    isVerified: true,
    createdAt: '2024-01-01T10:00:00Z',
    address: '123 Đường Nguyễn Trãi, Quận 1, TP.HCM',
  },
  {
    id: 'user-002',
    email: 'user@gmail.com',
    name: 'Nguyễn Văn A',
    phone: '0987654321',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    role: 'user',
    isVerified: true,
    createdAt: '2024-01-05T10:00:00Z',
    address: '456 Đường Lê Lợi, Quận 3, TP.HCM',
  },
  {
    id: 'user-003',
    email: 'newuser@example.com',
    name: 'Trần Thị B',
    phone: '0977123456',
    role: 'user',
    isVerified: false,
    createdAt: '2024-01-15T10:00:00Z',
  },
];

export const currentUser: User = users[1];
