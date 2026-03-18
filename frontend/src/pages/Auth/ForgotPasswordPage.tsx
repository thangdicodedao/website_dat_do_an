import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button, Input } from '../../components/common';
import { authAPI } from '../../services';
import { useToast } from '../../components/common/Toast';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      showToast('error', 'Vui lòng nhập email');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast('error', 'Email không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setIsSubmitted(true);
      showToast('success', 'Mã xác thực đã được gửi đến email của bạn');
    } catch (error: any) {
      showToast('error', error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Kiểm tra email của bạn
            </h1>
            <p className="text-gray-500 mb-6">
              Chúng tôi đã gửi mã xác thực đến<br />
              <span className="font-medium text-gray-700">{email}</span>
            </p>
            <Link to="/verify-forgot-password" state={{ email }}>
              <Button className="w-full" size="lg">
                Tiếp tục
              </Button>
            </Link>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
              className="mt-4 text-red-500 hover:text-red-600 text-sm"
            >
              Gửi lại email khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Quên mật khẩu?</h1>
            <p className="text-gray-500 mt-2">
              Nhập email của bạn để lấy lại mật khẩu
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="Nhập email của bạn"
              icon={<Mail className="w-5 h-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              Gửi mã xác thực
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-500">Nhớ mật khẩu? </span>
            <Link to="/login" className="text-red-500 font-medium hover:text-red-600">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
