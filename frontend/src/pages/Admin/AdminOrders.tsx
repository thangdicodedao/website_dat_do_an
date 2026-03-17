import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Menu, Search, Eye } from 'lucide-react';
import { PageLoader } from '../../components/common';
import { orderAPI } from '../../services';
import { Order } from '../../types';
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '../../utils';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderAPI.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuItems = [
    { label: 'Tổng quan', href: '/admin', icon: <Package className="w-5 h-5" /> },
    { label: 'Sản phẩm', href: '/admin/products', icon: <Package className="w-5 h-5" /> },
    { label: 'Đơn hàng', href: '/admin/orders', icon: <Package className="w-5 h-5" /> },
    { label: 'Người dùng', href: '/admin/users', icon: <Package className="w-5 h-5" /> },
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center"><span className="text-white font-bold">C</span></div>
            <span className="font-bold text-xl">Admin</span>
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} to={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${item.href === '/admin/orders' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-orange-50'}`}>
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl">
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="text-orange-500 hover:text-orange-600 font-medium">Về trang chủ</Link>
        </header>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý đơn hàng</h1>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm đơn hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thanh toán</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-gray-600">{order.userName}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.paymentMethod === 'vnpay' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                          {order.paymentMethod === 'vnpay' ? 'VNPAY' : 'COD'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                          {getStatusLabel(order.orderStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
