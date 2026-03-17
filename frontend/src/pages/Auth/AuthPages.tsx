import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '../../components/common';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { login, register } from '../../store/slices/authSlice';
import { useToast } from '../../components/common/Toast';

export default function AuthPages() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const { showToast } = useToast();

  const isLogin = location.pathname === '/login';

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      errors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!isLogin) {
      if (!formData.name) {
        errors.name = 'Tên là bắt buộc';
      }
      if (!formData.phone) {
        errors.phone = 'Số điện thoại là bắt buộc';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isLogin) {
        await dispatch(login({
          email: formData.email,
          password: formData.password,
        })).unwrap();
        showToast('success', 'Đăng nhập thành công!');
        navigate('/');
      } else {
        await dispatch(register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
        })).unwrap();
        showToast('success', 'Đăng ký thành công! Vui lòng xác thực email.');
        navigate('/verify-email', { state: { email: formData.email } });
      }
    } catch (err: any) {
      showToast('error', err.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản'}
            </h1>
            <p className="text-gray-500 mt-2">
              {isLogin
                ? 'Đăng nhập để tiếp tục đặt món'
                : 'Đăng ký để trải nghiệm tốt hơn'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <Input
                  label="Họ và tên"
                  placeholder="Nhập họ và tên"
                  icon={<User className="w-5 h-5" />}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={formErrors.name}
                />
                <Input
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại"
                  icon={<Phone className="w-5 h-5" />}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={formErrors.phone}
                />
              </>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="Nhập email của bạn"
              icon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={formErrors.email}
            />

            <div className="relative">
              <Input
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                icon={<Lock className="w-5 h-5" />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={formErrors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-500">
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            </span>{' '}
            <Link
              to={isLogin ? '/register' : '/login'}
              className="text-orange-500 font-medium hover:text-orange-600"
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
