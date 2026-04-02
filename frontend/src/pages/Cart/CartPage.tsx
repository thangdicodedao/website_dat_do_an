import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem as CartItemComponent } from '../../components/features';
import { Button, EmptyState } from '../../components/common';
import { useAppSelector } from '../../hooks';
import { formatPrice } from '../../utils';

export default function CartPage() {
  const { items, cart } = useAppSelector((state) => state.cart);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <EmptyState
            icon={<ShoppingBag className="w-10 h-10" />}
            title="Giỏ hàng trống"
            description="Hãy thêm sản phẩm vào giỏ hàng của bạn"
            actionLabel="Khám phá món ăn"
            onAction={() => window.location.href = '/products'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-3 md:px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm sticky top-20 md:top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Tổng quan đơn hàng
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({items.length} sản phẩm)</span>
                  <span>{formatPrice(cart?.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Thuế (4.5%)</span>
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
                  <span className="text-xl font-bold text-red-600">
                    {formatPrice(cart?.total || 0)}
                  </span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã giảm giá
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <Button variant="outline">Áp dụng</Button>
                </div>
              </div>

              <Button className="w-full" size="lg">
                <Link to="/checkout" className="flex items-center justify-center gap-2">
                  Tiến hành thanh toán
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Link
                to="/products"
                className="block text-center mt-4 text-red-500 hover:text-red-600"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
