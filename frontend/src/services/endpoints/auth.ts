import { mockApi } from '../api';
import { User, LoginCredentials, RegisterData, VerifyEmailData, ForgotPasswordData } from '../../types';
import { users } from '../../data';

const VERIFICATION_CODES: Record<string, string> = {};

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    await mockApi.delay(800);

    const user = users.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    // Mock password check (in real app, password would be hashed)
    if (credentials.password.length < 6) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    const token = `mock_token_${user.id}_${Date.now()}`;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  },

  register: async (data: RegisterData): Promise<{ user: User; message: string }> => {
    await mockApi.delay(1000);

    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('Email đã được sử dụng');
    }

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    VERIFICATION_CODES[data.email] = code;

    console.log(`Verification code for ${data.email}: ${code}`); // For testing

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: 'user',
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    // Save to local storage for persistence
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));

    return { user: newUser, message: `Mã xác thực đã được gửi đến ${data.email}` };
  },

  verifyEmail: async (data: VerifyEmailData): Promise<{ user: User; token: string }> => {
    await mockApi.delay(500);

    const storedCode = VERIFICATION_CODES[data.email];
    if (!storedCode || storedCode !== data.code) {
      throw new Error('Mã xác thực không đúng');
    }

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const user = storedUsers.find((u: User) => u.email === data.email);

    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    user.isVerified = true;
    localStorage.setItem('users', JSON.stringify(storedUsers));

    const token = `mock_token_${user.id}_${Date.now()}`;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    delete VERIFICATION_CODES[data.email];

    return { user, token };
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    await mockApi.delay(800);

    const user = users.find(u => u.email === data.email);
    if (!user) {
      // Don't reveal if email exists
      return { message: 'Nếu email tồn tại, mã xác thực sẽ được gửi' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    VERIFICATION_CODES[`reset_${data.email}`] = code;

    console.log(`Reset code for ${data.email}: ${code}`); // For testing

    return { message: 'Mã xác thực đã được gửi đến email của bạn' };
  },

  logout: async (): Promise<void> => {
    await mockApi.delay(300);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<User | null> => {
    await mockApi.delay(300);

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  resendCode: async (email: string): Promise<{ message: string }> => {
    await mockApi.delay(500);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    VERIFICATION_CODES[email] = code;

    console.log(`New verification code for ${email}: ${code}`);

    return { message: 'Mã xác thực mới đã được gửi' };
  },
};
