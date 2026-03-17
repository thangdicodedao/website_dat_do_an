import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Banknote, CheckCircle } from 'lucide-react';
import { Button, Input } from '../../components/common';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { createOrder } from '../../store/slices/orderSlice';
import { formatPrice } from '../../utils';
import { PaymentMethod } from '../../types';
import { useToast } from '../../components/common/Toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { items, cart } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      showToast('error', 'Vui lòng đăng nhập để đặt hàng');
      navigate('/login');
      return;
    }

    if (!deliveryAddress) {
      showToast('error', 'Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    if (!phone) {
      showToast('error', 'Vui lòng nhập số điện thoại');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await dispatch(createOrder({
        userId: user!.id,
        deliveryAddress,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          notes: item.notes,
        })),
        paymentMethod,
        notes,
      })).unwrap();

      showToast('success', 'Đặt hàng thành công!');

      if (paymentMethod === 'vnpay') {
        // Mock VNPAY redirect
        showToast('info', 'Đang chuyển hướng đến VNPAY...');
        setTimeout(() => {
          navigate(`/order-confirmation/${result.id}`);
        }, 1500);
      } else {
        navigate(`/order-confirmation/${result.id}`);
      }
    } catch (error: any) {
      showToast('error', error.message || 'Đặt hàng thất bại');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cart" className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Thanh toán</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin giao hàng
              </h2>
              <div className="space-y-4">
                <Input
                  label="Họ và tên"
                  value={user?.name || ''}
                  disabled
                />
                <Input
                  label="Số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Địa chỉ giao hàng
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Nhập địa chỉ chi tiết..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chú cho đơn hàng..."
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                <label className={`
                  flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${paymentMethod === 'cod'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="sr-only"
                  />
                  <Banknote className="w-6 h-6 text-orange-500" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</div>
                    <div className="text-sm text-gray-500">Trả tiền mặt khi nhận được hàng</div>
                  </div>
                  {paymentMethod === 'cod' && (
                    <CheckCircle className="w-6 h-6 text-orange-500" />
                  )}
                </label>

                <label className={`
                  flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${paymentMethod === 'vnpay'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}>
                  <input
                    type="radio"
                    name="payment"
                    value="vnpay"
                    checked={paymentMethod === 'vnpay'}
                    onChange={() => setPaymentMethod('vnpay')}
                    className="sr-only"
                  />
                  <CreditCard className="w-6 h-6 text-orange-500" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Thanh toán qua VNPAY</div>
                    <div className="text-sm text-gray-500">Thanh toán trực tuyến an toàn qua VNPAY</div>
                  </div>
                  {paymentMethod === 'vnpay' && (
                    <CheckCircle className="w-6 h-6 text-orange-500" />
                  )}
                </label>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Danh sách món ({items.length})
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.product.name}</div>
                      <div className="text-sm text-gray-500">x{item.quantity}</div>
                    </div>
                    <div className="font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Tổng quan đơn hàng
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatPrice(cart?.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Thuế (10%)</span>
                  <span>{formatPrice(cart?.tax || 0)}</span>
                </div>
                {cart?.discount && cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(cart.discount)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {formatPrice(cart?.total || 0)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handlePlaceOrder}
                isLoading={isProcessing}
              >
                {isProcessing ? 'Đang xử lý...' : 'Đặt hàng'}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Bằng cách đặt hàng, bạn đồng ý với điều khoản của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
