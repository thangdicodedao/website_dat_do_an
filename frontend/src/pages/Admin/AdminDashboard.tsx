import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { ProductListSkeleton } from '../../components/common';
import { userAPI } from '../../services';
import { AdminStats } from '../../types';
import { formatPrice } from '../../utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

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
    return <ProductListSkeleton count={6} />;
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
      color: 'bg-red-500',
      trend: '+8%',
      trendUp: true,
    },
  ];

  return (
    <>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Tổng quan</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-start justify-between mb-2 md:mb-4">
              <div className={`p-2 md:p-3 rounded-xl ${stat.color}`}>
                <span className="text-white [&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-6 md:[&>svg]:h-6">{stat.icon}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs md:text-sm ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trendUp ? <TrendingUp className="w-3 h-3 md:w-4 md:h-4" /> : <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />}
                {stat.trend}
              </div>
            </div>
            <div className="text-lg md:text-2xl font-bold text-gray-900 mb-0.5 md:mb-1">{stat.value}</div>
            <div className="text-xs md:text-sm text-gray-500">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Thống kê nhanh</h2>
          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm md:text-base">Tổng doanh thu</span>
              <span className="font-semibold text-gray-900 text-sm md:text-base">{formatPrice(stats?.totalRevenue || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm md:text-base">Tổng đơn hàng</span>
              <span className="font-semibold text-gray-900 text-sm md:text-base">{stats?.totalOrders || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm md:text-base">Người dùng mới hôm nay</span>
              <span className="font-semibold text-gray-900 text-sm md:text-base">{stats?.newUsersToday || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm md:text-base">Sản phẩm sắp hết hàng</span>
              <span className="font-semibold text-red-500 text-sm md:text-base">{stats?.lowStockProducts || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Liên kết nhanh</h2>
          <div className="space-y-2 md:space-y-3">
            <Link
              to="/admin/products"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors"
            >
              <span className="text-gray-700 text-sm md:text-base">Quản lý sản phẩm</span>
              <Package className="w-5 h-5 text-red-500" />
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors"
            >
              <span className="text-gray-700 text-sm md:text-base">Quản lý đơn hàng</span>
              <ShoppingCart className="w-5 h-5 text-red-500" />
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors"
            >
              <span className="text-gray-700 text-sm md:text-base">Quản lý người dùng</span>
              <Users className="w-5 h-5 text-red-500" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
