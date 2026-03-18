import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, Lock, MapPin, Plus, Trash2, Edit, Star, Check, Save, X, CreditCard, Clock } from 'lucide-react';
import { Button, Input, ProfileSkeleton } from '../../components/common';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchOrders } from '../../store/slices/orderSlice';
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '../../utils';

// Types
interface Address {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  label?: string; // Ghi chú địa chỉ (VD: Nhà riêng, Cơ quan,...)
  isDefault: boolean;
}

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
}

// Mock favorites data
const mockFavorites: FavoriteProduct[] = [
  {
    id: '1',
    name: 'Phở Bò Nạm',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: '2',
    name: 'Bún Bò Huế',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1534429818389-76febb7f768d?w=400',
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: '3',
    name: 'Trà Đá Chanh',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    rating: 4.5,
    reviewCount: 67,
  },
  {
    id: '4',
    name: 'Khoai Tây Chiên',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    rating: 4.6,
    reviewCount: 156,
  },
];

// Timeline Item Component
function TimelineItem({ label, date, isCompleted, isLast = false }: { label: string; date?: string; isCompleted: boolean; isLast?: boolean }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
        {!isLast && <div className={`w-0.5 h-8 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />}
      </div>
      <div className="flex-1 pb-4">
        <p className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>{label}</p>
        {date && <p className="text-xs text-gray-500 mt-0.5">{formatDate(date)}</p>}
      </div>
    </div>
  );
}

// Profile Info Tab Component
function ProfileInfoTab({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const handleSave = () => {
    // API call to update profile would go here
    setIsEditing(false);
    alert('Cập nhật thông tin thành công!');
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Thông tin tài khoản</h2>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-1" /> Sửa
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
          {isEditing ? (
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user?.name}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-500">{user?.email}</div>
          <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          {isEditing ? (
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Nhập số điện thoại"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user?.phone || 'Chưa cập nhật'}</div>
          )}
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
              Hủy
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" /> Lưu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { orders, loading } = useAppSelector((state) => state.orders);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'favorites' | 'password'>('orders');

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      phone: '0912345678',
      email: 'a@gmail.com',
      address: '123 Đường Nguyễn Trãi, Quận 1, TP.HCM',
      label: 'Nhà riêng',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Nguyễn Văn A',
      phone: '0912345678',
      email: 'a@gmail.com',
      address: '456 Đường Lê Văn Sỹ, Quận 3, TP.HCM',
      label: 'Cơ quan',
      isDefault: false,
    },
    {
      id: '3',
      name: 'Nguyễn Văn A',
      phone: '0912345678',
      address: '789 Đường Pasteur, Quận 1, TP.HCM',
      label: 'Nhà riêng',
      isDefault: false,
    },
  ]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  // Order detail state
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  const handleDeleteAddress = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handleSaveAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAddress: Address = {
      id: editingAddress?.id || Date.now().toString(),
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string || undefined,
      address: formData.get('address') as string,
      label: (formData.get('label') as string) || undefined,
      isDefault: addresses.length === 0 || formData.get('isDefault') === 'on',
    };

    if (editingAddress) {
      setAddresses(addresses.map(addr => addr.id === editingAddress.id ? newAddress : addr));
    } else {
      setAddresses([...addresses, newAddress]);
    }

    setShowAddAddress(false);
    setEditingAddress(null);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setPasswordError('');
    alert('Đổi mật khẩu thành công!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const tabs = [
    { id: 'orders', label: 'Lịch sử đơn hàng', icon: Package },
    { id: 'profile', label: 'Thông tin tài khoản', icon: User },
    { id: 'addresses', label: 'Địa chỉ', icon: MapPin },
    { id: 'favorites', label: 'Yêu thích', icon: Heart },
    { id: 'password', label: 'Đổi mật khẩu', icon: Lock },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-3 md:px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-red-500" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loading ? (
              <ProfileSkeleton />
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
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white rounded-2xl p-4 md:p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
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
                    <span className="font-semibold text-red-600">{formatPrice(order.total)}</span>
                    <span className="text-sm text-red-500">Xem chi tiết</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <ProfileInfoTab user={user} />
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Địa chỉ của tôi</h2>
              <Button size="sm" onClick={() => setShowAddAddress(true)}>
                <Plus className="w-4 h-4 mr-1" /> Thêm địa chỉ
              </Button>
            </div>

            {addresses.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Chưa có địa chỉ nào</p>
                <Button onClick={() => setShowAddAddress(true)}>Thêm địa chỉ</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div key={address.id} className={`bg-white rounded-2xl p-4 md:p-6 shadow-sm relative ${address.isDefault ? 'ring-2 ring-red-500' : ''}`}>
                    {address.isDefault && (
                      <span className="absolute top-4 right-4 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        Mặc định
                      </span>
                    )}
                    <div className="space-y-2">
                      {address.label && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {address.label}
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{address.name}</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-gray-600">{address.phone}</span>
                      </div>
                      {address.email && (
                        <p className="text-sm text-gray-500">{address.email}</p>
                      )}
                      <p className="text-sm text-gray-600">{address.address}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                      {!address.isDefault && (
                        <Button variant="outline" size="sm" onClick={() => handleSetDefaultAddress(address.id)}>
                          <Check className="w-4 h-4 mr-1" /> Đặt mặc định
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => { setEditingAddress(address); setShowAddAddress(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAddress(address.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Sản phẩm yêu thích</h2>
            {mockFavorites.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Chưa có sản phẩm yêu thích nào</p>
                <Link to="/products">
                  <Button>Khám phá sản phẩm</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockFavorites.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm">
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-xl mb-3" />
                    <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-500">{product.rating} ({product.reviewCount})</span>
                    </div>
                    <p className="font-semibold text-red-500 mt-2">{formatPrice(product.price)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm max-w-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Đổi mật khẩu</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Mật khẩu hiện tại"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
              <Input
                label="Mật khẩu mới"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
              <Input
                label="Xác nhận mật khẩu mới"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                error={passwordError}
                required
              />
              <Button type="submit" className="w-full">Đổi mật khẩu</Button>
            </form>
          </div>
        )}
      </div>

      {/* Add/Edit Address Modal */}
      {showAddAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </h3>
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <Input
                label="Tên người nhận"
                name="name"
                defaultValue={editingAddress?.name}
                placeholder="Nguyễn Văn A"
                required
              />
              <Input
                label="Số điện thoại"
                name="phone"
                type="tel"
                defaultValue={editingAddress?.phone}
                placeholder="0912345678"
                required
              />
              <Input
                label="Ghi chú (VD: Nhà riêng, Cơ quan...)"
                name="label"
                defaultValue={editingAddress?.label}
                placeholder="Nhà riêng"
              />
              <Input
                label="Email (tùy chọn)"
                name="email"
                type="email"
                defaultValue={editingAddress?.email}
                placeholder="email@example.com"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <textarea
                  name="address"
                  defaultValue={editingAddress?.address}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, thành phố"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              {!editingAddress && addresses.length > 0 && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isDefault" className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">Đặt làm địa chỉ mặc định</span>
                </label>
              )}
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setShowAddAddress(false); setEditingAddress(null); }}>
                  Hủy
                </Button>
                <Button type="submit" className="flex-1">
                  Lưu
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedOrder.orderNumber}</h3>
                <p className="text-sm text-gray-500">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Trạng thái</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                  {getStatusLabel(selectedOrder.orderStatus)}
                </span>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Sản phẩm</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                      <span className="font-medium text-gray-900 text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Địa chỉ giao hàng
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-sm text-gray-900">{selectedOrder.shippingAddress.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">{selectedOrder.shippingAddress.address}</p>
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Thanh toán
                </h4>
                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phương thức</span>
                    <span className="text-gray-900">
                      {selectedOrder.paymentMethod === 'vnpay' ? 'VNPAY' : 'Tiền mặt (COD)'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="text-gray-900">{formatPrice(selectedOrder.subtotal || selectedOrder.total - 30000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="text-gray-900">{formatPrice(30000)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium border-t pt-2">
                    <span className="text-gray-900">Tổng cộng</span>
                    <span className="text-red-600">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Lịch sử đơn hàng
                </h4>
                <div className="space-y-3">
                  <TimelineItem
                    label="Đặt hàng thành công"
                    date={selectedOrder.createdAt}
                    isCompleted={true}
                  />
                  <TimelineItem
                    label="Xác nhận đơn hàng"
                    date={selectedOrder.confirmedAt}
                    isCompleted={['confirmed', 'processing', 'shipped', 'delivered'].includes(selectedOrder.orderStatus)}
                  />
                  <TimelineItem
                    label="Đang chuẩn bị"
                    date={selectedOrder.processingAt}
                    isCompleted={['processing', 'shipped', 'delivered'].includes(selectedOrder.orderStatus)}
                  />
                  <TimelineItem
                    label="Đang giao hàng"
                    date={selectedOrder.shippedAt}
                    isCompleted={['shipped', 'delivered'].includes(selectedOrder.orderStatus)}
                  />
                  <TimelineItem
                    label="Giao hàng thành công"
                    date={selectedOrder.deliveredAt}
                    isCompleted={selectedOrder.orderStatus === 'delivered'}
                    isLast={true}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white p-4 border-t rounded-b-2xl">
              <Button variant="outline" className="w-full" onClick={() => setSelectedOrder(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
