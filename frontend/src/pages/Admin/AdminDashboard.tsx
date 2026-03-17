import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown, Menu } from 'lucide-react';
import { PageLoader } from '../../components/common';
import { userAPI } from '../../services';
import { AdminStats } from '../../types';
import { formatPrice } from '../../utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await userAPI.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  const statCards = [
    {
      title: 'Doanh thu hôm nay',
      value: formatPrice(stats?.todayRevenue || 0),
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-500',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Đơn hàng hôm nay',
      value: stats?.todayOrders || 0,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-blue-500',
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'Tổng sản phẩm',
      value: stats?.totalProducts || 0,
      icon: <Package className="w-6 h-6" />,
      color: 'bg-purple-500',
      trend: '0%',
      trendUp: true,
    },
    {
      title: 'Tổng người dùng',
      value: stats?.totalUsers || 0,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-orange-500',
      trend: '+8%',
      trendUp: true,
    },
  ];

  const menuItems = [
    { label: 'Tổng quan', href: '/admin', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Sản phẩm', href: '/admin/products', icon: <Package className="w-5 h-5" /> },
    { label: 'Đơn hàng', href: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { label: 'Người dùng', href: '/admin/users', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="font-bold text-xl">Admin</span>
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between lg:justify-end">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link
            to="/"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Về trang chủ
          </Link>
        </header>

        {/* Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Tổng quan</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <span className="text-white">{stat.icon}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {stat.trend}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.title}</div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tổng doanh thu</span>
                  <span className="font-semibold text-gray-900">{formatPrice(stats?.totalRevenue || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tổng đơn hàng</span>
                  <span className="font-semibold text-gray-900">{stats?.totalOrders || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Người dùng mới hôm nay</span>
                  <span className="font-semibold text-gray-900">{stats?.newUsersToday || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sản phẩm sắp hết hàng</span>
                  <span className="font-semibold text-red-500">{stats?.lowStockProducts || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Liên kết nhanh</h2>
              <div className="space-y-3">
                <Link
                  to="/admin/products"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  <span className="text-gray-700">Quản lý sản phẩm</span>
                  <Package className="w-5 h-5 text-orange-500" />
                </Link>
                <Link
                  to="/admin/orders"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  <span className="text-gray-700">Quản lý đơn hàng</span>
                  <ShoppingCart className="w-5 h-5 text-orange-500" />
                </Link>
                <Link
                  to="/admin/users"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  <span className="text-gray-700">Quản lý người dùng</span>
                  <Users className="w-5 h-5 text-orange-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
