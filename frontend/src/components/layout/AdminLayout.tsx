import { useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  MessagesSquare,
  MessageSquare,
  Bell,
  Settings,
  Menu,
  ChevronRight,
  CalendarDays,
  LucideIcon,
} from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

const menuItems: MenuItem[] = [
  { label: 'Tổng quan', href: '/admin', icon: LayoutDashboard, description: 'Báo cáo và chỉ số' },
  { label: 'Sản phẩm', href: '/admin/products', icon: Package, description: 'Danh mục và tồn kho' },
  { label: 'Danh mục', href: '/admin/categories', icon: Tags, description: 'Nhóm sản phẩm và hiển thị' },
  { label: 'Đơn hàng', href: '/admin/orders', icon: ShoppingCart, description: 'Theo dõi trạng thái đơn' },
  { label: 'Người dùng', href: '/admin/users', icon: Users, description: 'Quản lý tài khoản' },
  { label: 'Nhắn tin', href: '/admin/messages', icon: MessagesSquare, description: 'Trao đổi với khách hàng' },
  { label: 'Đánh giá', href: '/admin/reviews', icon: MessageSquare, description: 'Duyệt và phản hồi đánh giá' },
  { label: 'Thông báo', href: '/admin/notifications', icon: Bell, description: 'Quản lý gửi thông báo' },
  { label: 'Cài đặt', href: '/admin/settings', icon: Settings, description: 'Thiết lập hệ thống' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentMenu = useMemo(() => {
    const exact = menuItems.find((item) => item.href === location.pathname);
    if (exact) return exact;

    return menuItems.find((item) =>
      item.href !== '/admin' && location.pathname.startsWith(item.href)
    ) || menuItems[0];
  }, [location.pathname]);

  const currentDate = useMemo(() => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200/80 shadow-xl lg:shadow-sm transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo / Branding */}
        <div className="p-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Bình Bún Bò"
              className="w-11 h-11 rounded-xl object-cover border border-red-100"
            />
            <div>
              <p className="font-bold text-xl text-gray-900 leading-tight">Admin</p>
              <p className="text-xs text-gray-500">Bình Bún Bò Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <p className="px-3 text-[11px] uppercase tracking-[0.14em] text-gray-400 font-semibold">
            Khu quản trị
          </p>
          {menuItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/admin'}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm ${
                  isActive
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-red-500" />}
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium leading-tight">{item.label}</p>
                    <p className={`text-xs truncate ${isActive ? 'text-red-400' : 'text-gray-400 group-hover:text-red-400'}`}>
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className={`ml-auto w-4 h-4 transition-transform ${isActive ? 'text-red-500 translate-x-0.5' : 'text-gray-300 group-hover:text-red-300'}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4">
          <Link
            to="/"
            className="block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur px-4 md:px-6 py-3.5 flex items-center justify-between border-b border-gray-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="min-w-0 flex-1 lg:flex-none">
            <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">{currentMenu.label}</h1>
            <p className="text-xs md:text-sm text-gray-500 truncate">{currentMenu.description}</p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-xl">
            <CalendarDays className="w-4 h-4" />
            <span className="capitalize">{currentDate}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
