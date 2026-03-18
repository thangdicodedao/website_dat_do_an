import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, Home, UtensilsCrossed, ChevronDown } from 'lucide-react';
import { cn } from '../../utils';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../store/slices/authSlice';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const popularSearches = [
    'Phở bò',
    'Bún bò',
    'Cà phê sữa đá',
    'Trà đá chanh',
    'Khoai tây chiên',
    'Gà rán',
    'Bánh mì',
    'Sinh tố',
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setShowMobileSearch(false);
    setShowSuggestions(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileSearch(false);
      setShowSuggestions(false);
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
    { label: 'Sản phẩm', href: '/products', hasDropdown: true },
    { label: 'Hỗ trợ', href: '/contact', hasDropdown: true },
  ];

  const categories = [
    { label: 'Tất cả', href: '/products' },
    { label: 'Món Chính', href: '/products?category=mon-chinh' },
    { label: 'Món Ăn Vặt', href: '/products?category=mon-an-vat' },
    { label: 'Đồ Uống', href: '/products?category=do-uong' },
    { label: 'Cơm & Phở', href: '/products?category=com-pho' },
    { label: 'Đồ Chay', href: '/products?category=do-chay' },
    { label: 'Bánh & Tráng Miệng', href: '/products?category=banh-trang-mieng' },
  ];

  const supportLinks = [
    { label: 'Liên hệ', href: '/contact' },
    { label: 'Câu hỏi thường gặp', href: '/faq' },
    { label: 'Chính sách vận chuyển', href: '/shipping' },
    { label: 'Chính sách đổi trả', href: '/return' },
    { label: 'Chính sách bảo mật', href: '/privacy' },
  ];

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-sm'
        )}
      >
        <div className="container mx-auto px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img src="/logo.jpg" alt="Bình Bún Bò" className="h-10 w-auto object-contain" />
              <span className="font-bold text-xl text-gray-900">
                Bình Bún Bò
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <div key={link.href} className="relative">
                  {link.hasDropdown ? (
                    <>
                      <button
                        onMouseEnter={() => setActiveDropdown(link.label)}
                        onClick={() => navigate(link.href)}
                        className={cn(
                          'font-medium transition-colors hover:text-red-500 flex items-center gap-1',
                          isActive(link.href) || activeDropdown === link.label
                            ? 'text-red-500'
                            : 'text-gray-700'
                        )}
                      >
                        {link.label}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {activeDropdown === link.label && (
                        <div
                          onMouseLeave={() => setActiveDropdown(null)}
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                        >
                          {link.label === 'Sản phẩm'
                            ? categories.map((cat) => (
                                <Link
                                  key={cat.href}
                                  to={cat.href}
                                  onClick={() => setActiveDropdown(null)}
                                  className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                                >
                                  {cat.label}
                                </Link>
                              ))
                            : supportLinks.map((item) => (
                                <Link
                                  key={item.href}
                                  to={item.href}
                                  onClick={() => setActiveDropdown(null)}
                                  className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                                >
                                  {item.label}
                                </Link>
                              ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      className={cn(
                        'font-medium transition-colors hover:text-red-500',
                        isActive(link.href)
                          ? 'text-red-500'
                          : 'text-gray-700'
                      )}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Actions - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {/* Search Bar - Desktop */}
              <div ref={searchRef} className="hidden lg:block relative mx-8 flex-1 max-w-2xl">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Tìm món ăn..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                    className={cn(
                      'w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50',
                      'focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white',
                      'transition-all duration-300'
                    )}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </form>

                {/* Search Suggestions */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Tìm kiếm phổ biến</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {popularSearches
                        .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchQuery(item);
                              navigate(`/products?search=${encodeURIComponent(item)}`);
                              setShowSuggestions(false);
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 transition-colors"
                          >
                            <Search className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{item}</span>
                          </button>
                        ))}
                      {popularSearches.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <div className="px-4 py-3 text-gray-500 text-sm">Không có gợi ý</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                className={cn(
                  'relative p-2.5 rounded-xl transition-all duration-300',
                  'bg-gray-100 hover:bg-red-50 text-gray-700'
                )}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
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
                      'bg-gray-100 hover:bg-red-50 text-gray-700'
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
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-500" onClick={() => setIsUserMenuOpen(false)}>
                        Tài khoản của tôi
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-500" onClick={() => setIsUserMenuOpen(false)}>
                        Lịch sử đơn hàng
                      </Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-500" onClick={() => setIsUserMenuOpen(false)}>
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
                <Link to="/login" className="px-4 py-2 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 hover:shadow-lg">
                  Đăng nhập
                </Link>
              )}

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
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
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
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </form>

              {/* Mobile Search Suggestions */}
              {showSuggestions && (
                <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">Tìm kiếm phổ biến</p>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {popularSearches
                      .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(item);
                            navigate(`/products?search=${encodeURIComponent(item)}`);
                            setShowMobileSearch(false);
                            setShowSuggestions(false);
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 transition-colors"
                        >
                          <Search className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{item}</span>
                        </button>
                      ))}
                    {popularSearches.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                      <div className="px-4 py-3 text-gray-500 text-sm">Không có gợi ý</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              {/* Sidebar */}
              <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl md:hidden animate-in slide-in-from-right-10 duration-300">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-bold text-lg text-gray-900">Menu</span>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <nav className="flex flex-col gap-2">
                    <Link
                      to="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'px-4 py-3 rounded-xl font-medium transition-colors',
                        isActive('/')
                          ? 'bg-red-500 text-white'
                          : 'text-gray-700 hover:bg-red-50'
                      )}
                    >
                      Trang chủ
                    </Link>
                    <Link
                      to="/products"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'px-4 py-3 rounded-xl font-medium transition-colors',
                        isActive('/products')
                          ? 'bg-red-500 text-white'
                          : 'text-gray-700 hover:bg-red-50'
                      )}
                    >
                      Sản phẩm
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'px-4 py-3 rounded-xl font-medium transition-colors',
                        isActive('/contact')
                          ? 'bg-red-500 text-white'
                          : 'text-gray-700 hover:bg-red-50'
                      )}
                    >
                      Liên hệ
                    </Link>
                    <Link
                      to="/faq"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'px-4 py-3 rounded-xl font-medium transition-colors',
                        isActive('/faq')
                          ? 'bg-red-500 text-white'
                          : 'text-gray-700 hover:bg-red-50'
                      )}
                    >
                      Câu hỏi thường gặp
                    </Link>
                    <Link
                      to="/shipping"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'px-4 py-3 rounded-xl font-medium transition-colors',
                        isActive('/shipping')
                          ? 'bg-red-500 text-white'
                          : 'text-gray-700 hover:bg-red-50'
                      )}
                    >
                      Chính sách vận chuyển
                    </Link>
                    <Link
                      to="/return"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'px-4 py-3 rounded-xl font-medium transition-colors',
                        isActive('/return')
                          ? 'bg-red-500 text-white'
                          : 'text-gray-700 hover:bg-red-50'
                      )}
                    >
                      Chính sách đổi trả
                    </Link>
                    <Link
                      to="/privacy"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'px-4 py-3 rounded-xl font-medium transition-colors',
                        isActive('/privacy')
                          ? 'bg-red-500 text-white'
                          : 'text-gray-700 hover:bg-red-50'
                      )}
                    >
                      Chính sách bảo mật
                    </Link>
                    {!isAuthenticated && (
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="mt-4 px-4 py-3 rounded-xl font-medium bg-red-500 text-white text-center hover:bg-red-600 transition-colors"
                      >
                        Đăng nhập
                      </Link>
                    )}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-4 py-2 pb-safe">
        <div className="flex items-center justify-around">
          <Link to="/" className={cn(
            'flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors',
            isActive('/') ? 'text-red-500' : 'text-gray-500'
          )}>
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Trang chủ</span>
          </Link>

          <Link to="/products" className={cn(
            'flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors',
            isActive('/products') ? 'text-red-500' : 'text-gray-500'
          )}>
            <UtensilsCrossed className="w-6 h-6" />
            <span className="text-xs font-medium">Menu</span>
          </Link>

          {isAuthenticated ? (
            <Link to="/profile" className={cn(
              'flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors',
              isActive('/profile') || isActive('/orders') ? 'text-red-500' : 'text-gray-500'
            )}>
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Tài khoản</span>
            </Link>
          ) : (
            <Link to="/login" className={cn(
              'flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors',
              isActive('/login') ? 'text-red-500' : 'text-gray-500'
            )}>
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Đăng nhập</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}
