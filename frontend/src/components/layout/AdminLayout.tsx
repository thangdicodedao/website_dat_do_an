import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Menu,
  LucideIcon,
} from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { label: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
  { label: 'Sản phẩm', href: '/admin/products', icon: Package },
  { label: 'Đơn hàng', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Người dùng', href: '/admin/users', icon: Users },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo / Branding */}
        <div className="p-4 md:p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm md:text-base">C</span>
            </div>
            <span className="font-bold text-lg md:text-xl">Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-2 md:p-4 space-y-1 md:space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-colors text-sm md:text-base ${
                  isActive
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
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
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between lg:justify-end border-b border-gray-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link
            to="/"
            className="text-red-500 hover:text-red-600 font-medium text-sm md:text-base"
          >
            Về trang chủ
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
