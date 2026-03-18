// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string;
  address?: string;
  password?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface ForgotPasswordData {
  email: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  video?: string;
  categoryId: string;
  categoryName: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isNew: boolean;
  preparationTime: number;
  calories?: number;
  ingredients?: string[];
  allergens?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  recommendedProducts: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

export interface ProductsQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  sortBy?: 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Cart {
  id: string;
  userId?: string;
  tableId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartState {
  cart: Cart | null;
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  notes?: string;
}

export interface UpdateCartItemData {
  cartItemId: string;
  quantity: number;
  notes?: string;
}

// Order types
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'vnpay';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  deliveryAddress?: string;
  tableId?: string;
  tableName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

export interface CreateOrderData {
  userId: string;
  deliveryAddress?: string;
  tableId?: string;
  items: {
    productId: string;
    quantity: number;
    notes?: string;
  }[];
  paymentMethod: PaymentMethod;
  notes?: string;
}

// Review types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  isVerified: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  averageRating: number;
  totalReviews: number;
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
}

// Table types (for QR ordering)
export interface Table {
  id: string;
  number: string;
  qrCode: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  location: string;
}

export interface TableState {
  tables: Table[];
  currentTable: Table | null;
  loading: boolean;
  error: string | null;
}

// Payment types
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paymentUrl?: string;
  createdAt: string;
  paidAt?: string;
}

export interface PaymentState {
  payment: Payment | null;
  loading: boolean;
  error: string | null;
}

export interface CreatePaymentData {
  orderId: string;
  method: PaymentMethod;
}

// Admin types
export interface AdminStats {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  todayOrders: number;
  totalUsers: number;
  newUsersToday: number;
  totalProducts: number;
  lowStockProducts: number;
}

export interface AdminState {
  stats: AdminStats;
  users: User[];
  orders: Order[];
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Toast types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Address types
export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}
