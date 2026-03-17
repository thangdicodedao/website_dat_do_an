import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, ChefHat, Home, UtensilsCrossed } from 'lucide-react';
import { cn } from '../../utils';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../store/slices/authSlice';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setShowMobileSearch(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sản phẩm', href: '/products' },
    { label: 'Liên hệ', href: '/contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-sm'
        )}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">
                Bếp Việt
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'font-medium transition-colors hover:text-orange-500',
                    isActive(link.href)
                      ? 'text-orange-500'
                      : 'text-gray-700'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {/* Search Bar - Desktop */}
              <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Tìm món ăn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      'w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50',
                      'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white',
                      'transition-all duration-300'
                    )}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </form>

              {/* Cart */}
              <Link
                to="/cart"
                className={cn(
                  'relative p-2.5 rounded-xl transition-all duration-300',
                  'bg-gray-100 hover:bg-orange-50 text-gray-700'
                )}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-xl transition-all duration-300',
                      'bg-gray-100 hover:bg-orange-50 text-gray-700'
                    )}
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500" onClick={() => setIsUserMenuOpen(false)}>
                        Tài khoản của tôi
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500" onClick={() => setIsUserMenuOpen(false)}>
                        Lịch sử đơn hàng
                      </Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500" onClick={() => setIsUserMenuOpen(false)}>
                          Quản lý
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="px-4 py-2 rounded-xl font-medium bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg">
                  Đăng nhập
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="hidden md:block p-2.5 rounded-xl bg-gray-100 text-gray-700">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Right Side Actions */}
            <div className="flex md:hidden items-center gap-2">
              {/* Search Toggle */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="p-2.5 rounded-xl bg-gray-100 text-gray-700"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative p-2.5 rounded-xl bg-gray-100 text-gray-700">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Menu Toggle */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2.5 rounded-xl bg-gray-100 text-gray-700">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Dropdown */}
          {showMobileSearch && (
            <div className="md:hidden mt-3 animate-in slide-in-from-top duration-200">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm món ăn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </form>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 animate-in slide-in-from-top duration-300">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'px-4 py-3 rounded-xl font-medium transition-colors',
                      isActive(link.href)
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-700 hover:bg-orange-50'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-4 py-2 pb-safe">
        <div className="flex items-center justify-around">
          <Link to="/" className={cn(
            'flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors',
            isActive('/') ? 'text-orange-500' : 'text-gray-500'
          )}>
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Trang chủ</span>
          </Link>

          <Link to="/products" className={cn(
            'flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors',
            isActive('/products') ? 'text-orange-500' : 'text-gray-500'
          )}>
            <UtensilsCrossed className="w-6 h-6" />
            <span className="text-xs font-medium">Menu</span>
          </Link>

          {isAuthenticated ? (
            <Link to="/profile" className={cn(
              'flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors',
              isActive('/profile') || isActive('/orders') ? 'text-orange-500' : 'text-gray-500'
            )}>
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Tài khoản</span>
            </Link>
          ) : (
            <Link to="/login" className={cn(
              'flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors',
              isActive('/login') ? 'text-orange-500' : 'text-gray-500'
            )}>
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Đăng nhập</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Spacer for fixed header */}
      <div className="h-20 md:h-20" />
      <div className="md:hidden h-20" />
    </>
  );
}
