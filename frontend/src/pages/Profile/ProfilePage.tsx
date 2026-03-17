import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package } from 'lucide-react';
import { Button, Input, PageLoader } from '../../components/common';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchOrders } from '../../store/slices/orderSlice';
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '../../utils';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { orders, loading } = useAppSelector((state) => state.orders);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchOrders({ userId: user.id }));
    }
  }, [dispatch, isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 mb-4">Vui lòng đăng nhập để xem thông tin</p>
          <Link to="/login">
            <Button>Đăng nhập</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-orange-500" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Lịch sử đơn hàng
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Thông tin tài khoản
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loading ? (
              <PageLoader />
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có đơn hàng nào</p>
                <Link to="/products">
                  <Button className="mt-4">Mua sắm ngay</Button>
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                      {getStatusLabel(order.orderStatus)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                          <p className="text-xs text-gray-500">x{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-500">+{order.items.length - 2} sản phẩm khác</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="font-semibold text-orange-600">{formatPrice(order.total)}</span>
                    <Link to={`/order/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin tài khoản</h2>
            <div className="space-y-4">
              <Input label="Họ và tên" value={user.name} disabled />
              <Input label="Email" value={user.email} disabled />
              <Input label="Số điện thoại" value={user.phone} disabled />
              <Input label="Địa chỉ" value={user.address || 'Chưa cập nhật'} disabled />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
