import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button, Input } from '../../components/common';
import { authAPI } from '../../services';
import { useToast } from '../../components/common/Toast';

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const email = (location.state as { email?: string })?.email || '';

  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      showToast('error', 'Vui lòng nhập mã xác thực 6 số');
      return;
    }

    setLoading(true);
    try {
      await authAPI.verifyEmail({ email, code: verificationCode });
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
            <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Xác thực email</h1>
            <p className="text-gray-500 mt-2">
              Nhập mã xác thực đã gửi đến<br />
              <span className="font-medium text-gray-700">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <Input
              label="Mã xác thực"
              placeholder="Nhập 6 số"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />

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
              className="text-orange-500 font-medium hover:text-orange-600 text-sm mt-1"
            >
              Gửi lại mã
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
