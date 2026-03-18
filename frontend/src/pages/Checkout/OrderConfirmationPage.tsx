import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import { Button, OrderSkeleton } from '../../components/common';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchOrderById } from '../../store/slices/orderSlice';
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '../../utils';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();
  const { currentOrder: order, loading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  if (loading || !order) {
    return <OrderSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Đặt hàng thành công!</h1>
            <p className="text-gray-500 mt-2">Cảm ơn bạn đã đặt hàng</p>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Mã đơn hàng: {order.orderNumber}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                {getStatusLabel(order.orderStatus)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Ngày đặt: {formatDate(order.createdAt)}</p>

            {/* Order Items */}
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Danh sách món</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img src={item.productImage} alt={item.productName} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-500">x{item.quantity}</p>
                    </div>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Thuế</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Tổng cộng</span>
                <span className="text-red-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          {order.deliveryAddress && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Thông tin giao hàng</h3>
              <p className="text-gray-600">{order.deliveryAddress}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1">
              <Download className="w-5 h-5 mr-2" />
              Tải hóa đơn
            </Button>
            <Link to="/products" className="flex-1">
              <Button className="w-full">
                Tiếp tục mua sắm
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
