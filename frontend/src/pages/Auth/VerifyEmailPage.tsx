import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common';
import { authAPI } from '../../services';
import { useToast } from '../../components/common/Toast';
import { useAppDispatch } from '../../hooks';
import { setUser } from '../../store/slices/authSlice';
import { resetAuthCleared } from '../../services/api';

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const email = (location.state as { email?: string })?.email || '';

  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      showToast('error', 'Vui lòng nhập mã xác thực 6 số');
      return;
    }

    setLoading(true);
    try {
      const { user } = await authAPI.verifyEmail({ email, code: verificationCode });
      dispatch(setUser(user));
      resetAuthCleared();
      showToast('success', 'Xác thực email thành công!');
      navigate('/');
    } catch (error: any) {
      showToast('error', error.message || 'Mã xác thực không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authAPI.resendCode(email);
      showToast('success', 'Mã xác thực mới đã được gửi');
    } catch (error: any) {
      showToast('error', error.message);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Xác thực email</h1>
            <p className="text-gray-500 mt-2">
              Nhập mã xác thực đã gửi đến<br />
              <span className="font-medium text-gray-700">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Mã xác thực
              </label>
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={verificationCode[index] || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      const newCode = verificationCode.split('');
                      newCode[index] = value;
                      const code = newCode.join('').slice(0, 6);
                      setVerificationCode(code);

                      // Auto focus next input
                      if (value && index < 5) {
                        const nextInput = document.getElementById(`otp-${index + 1}`);
                        nextInput?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      // Handle backspace
                      if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                        const prevInput = document.getElementById(`otp-${index - 1}`);
                        prevInput?.focus();
                      }
                    }}
                    id={`otp-${index}`}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                  />
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              Xác thực
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Chưa nhận được mã?
            </p>
            <button
              onClick={handleResend}
              className="text-red-500 font-medium hover:text-red-600 text-sm mt-1"
            >
              Gửi lại mã
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
