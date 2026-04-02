# SƠ ĐỒ LỚP (CLASS DIAGRAM)
## Hệ thống Website Đặt Đồ Ăn - Bình Bún Bò

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1 Mô tả hệ thống

Đồ án xây dựng một **website thương mại điện tử** (e-commerce) phục vụ việc đặt đồ ăn trực tuyến cho nhà hàng **Bình Bún Bò**. Hệ thống hỗ trợ:

- **Khách hàng**: Xem sản phẩm, tìm kiếm, đặt hàng, thanh toán (COD/VNPAY), quản lý tài khoản, đặt hàng qua QR code tại bàn
- **Quản trị viên (Admin)**: Quản lý sản phẩm, đơn hàng, người dùng, xem thống kê

### 1.2 Công nghệ sử dụng

| Lớp | Công nghệ |
|------|-----------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS 4 + Redux Toolkit |
| Backend | Node.js + Express (sẽ phát triển) |
| Cơ sở dữ liệu | MongoDB (thiết kế quan hệ thực thể cho MongoDB) |
| Thanh toán | VNPay (mock), COD |
| QR Ordering | QR Code generation + scanning |

---

## 2. KIẾN TRÚC PHÂN LỚP

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  (React Components - Pages, Layouts, UI Components)      │
├─────────────────────────────────────────────────────────┤
│                    BUSINESS LOGIC LAYER                  │
│  (Redux Slices - State Management & Business Rules)     │
├─────────────────────────────────────────────────────────┤
│                    SERVICE LAYER                         │
│  (API Services - HTTP calls, Authentication)             │
├─────────────────────────────────────────────────────────┤
│                    DATA ACCESS LAYER                     │
│  (Types/Interfaces - Data Models)                       │
└─────────────────────────────────────────────────────────┘
```

---

## 3. SƠ ĐỒ CÁC LỚP CHÍNH

### 3.1 LỚP NGƯỜI DÙNG (User)

```typescript
┌──────────────────────────────────────────────────────────────┐
│                          «entity»                             │
│                          <<User>>                             │
├──────────────────────────────────────────────────────────────┤
│ - id: string                  [PK]                            │
│ - email: string               [UQ, NOT NULL]                 │
│ - password: string            [NOT NULL]                     │
│ - name: string                [NOT NULL]                     │
│ - phone: string               [NOT NULL]                     │
│ - avatar?: string                                            │
│ - role: UserRole              ['user', 'admin'] [DEFAULT: user]│
│ - isVerified: boolean         [DEFAULT: false]               │
│ - createdAt: Date             [DEFAULT: now]                 │
│ - updatedAt: Date             [auto-update]                   │
│ - address?: string                                           │
├──────────────────────────────────────────────────────────────┤
│ + login(email, password): Promise<User>                      │
│ + register(email, password, name, phone): Promise<Result>    │
│ + verifyEmail(email, code): Promise<User>                   │
│ + forgotPassword(email): Promise<void>                       │
│ + resetPassword(email, code, newPassword): Promise<void>     │
│ + logout(): Promise<void>                                    │
│ + getCurrentUser(): Promise<User | null>                     │
│ + updateProfile(updates): Promise<User>                      │
│ + changePassword(currentPassword, newPassword): Promise<void>│
│ + getAddresses(): Address[]                                  │
│ + addAddress(address): Promise<Address>                     │
│ + updateAddress(id, address): Promise<Address>              │
│ + deleteAddress(id): Promise<void>                          │
│ + setDefaultAddress(id): Promise<void>                       │
└──────────────────────────────────────────────────────────────┘
```

**Quy tắc nghiệp vụ:**
- Email phải là duy nhất trong toàn hệ thống
- Password phải được hash trước khi lưu (bcrypt)
- Mật khẩu phải có ít nhất 6 ký tự
- User mới được tạo với `isVerified = false`, cần xác thực email trước khi đặt hàng
- Có 2 loại role: `user` (khách hàng) và `admin` (quản trị viên)

---

### 3.2 LỚP SẢN PHẨM (Product)

```typescript
┌─────────────────────────────────────────────────────────────────┐
│                          «entity»                                │
│                        <<Product>>                               │
├─────────────────────────────────────────────────────────────────┤
│ - id: string                    [PK]                            │
│ - name: string                  [NOT NULL]                      │
│ - slug: string                  [UQ]                             │
│ - description: string                                           │
│ - price: number                  [NOT NULL, >= 0]                │
│ - originalPrice?: number         [>= 0]                          │
│ - images: string[]               [NOT NULL, min: 1]              │
│ - video?: string                                                 │
│ - categoryId: string             [FK → Category]                 │
│ - categoryName: string           [denormalized]                  │
│ - rating: number                 [0-5, DEFAULT: 0]                │
│ - reviewCount: number            [DEFAULT: 0]                    │
│ - isAvailable: boolean           [DEFAULT: true]                 │
│ - isFeatured: boolean            [DEFAULT: false]                │
│ - isNew: boolean                 [DEFAULT: false]                │
│ - preparationTime: number        [phút, DEFAULT: 15]             │
│ - calories?: number                                              │
│ - ingredients?: string[]                                         │
│ - allergens?: string[]                                          │
│ - tags: string[]                                                │
│ - stock: number                  [DEFAULT: 0]                  │
│ - createdAt: Date                [DEFAULT: now]                  │
│ - updatedAt: Date                [auto-update]                   │
├─────────────────────────────────────────────────────────────────┤
│ + getProducts(query?: ProductsQuery): ProductsResponse           │
│ + getProductById(id): Promise<Product | null>                   │
│ + getFeaturedProducts(): Promise<Product[]>                     │
│ + getRecommendedProducts(productId?): Promise<Product[]>        │
│ + getNewProducts(): Promise<Product[]>                          │
│ + getProductsByCategory(categoryId): Promise<Product[]>          │
│ + searchProducts(keyword): Promise<Product[]>                    │
│ + createProduct(data): Promise<Product>         [Admin only]    │
│ + updateProduct(id, updates): Promise<Product>    [Admin only]   │
│ + deleteProduct(id): Promise<void>               [Admin only]   │
│ + updateRating(productId, newRating): void                      │
└─────────────────────────────────────────────────────────────────┘
```

**Quy tắc nghiệp vụ:**
- `price` luôn >= 0, tính bằng VND
- `originalPrice` dùng để hiển thị giá gốc (nếu có khuyến mãi)
- `isAvailable = false` khi hết hàng hoặc tạm ngưng bán
- Mỗi sản phẩm phải thuộc về một danh mục (category)
- `slug` được tạo tự động từ name (ví dụ: "Bún Bò Huế" → "bun-bo-hue")
- Sản phẩm nổi bật (`isFeatured`) hiển thị trên trang chủ
- Sản phẩm mới (`isNew`) được đánh dấu khi mới tạo

---

### 3.3 LỚP DANH MỤC (Category)

```typescript
┌─────────────────────────────────────────────────────────────────┐
│                          «entity»                                │
│                       <<Category>>                               │
├─────────────────────────────────────────────────────────────────┤
│ - id: string                    [PK]                            │
│ - name: string                  [NOT NULL]                      │
│ - slug: string                  [UQ]                            │
│ - description?: string                                           │
│ - image: string                                                  │
│ - parentId?: string             [FK → Category, self-ref]        │
│ - isActive: boolean             [DEFAULT: true]                  │
│ - sortOrder: number            [DEFAULT: 0]                      │
│ - createdAt: Date              [DEFAULT: now]                   │
│ - updatedAt: Date              [auto-update]                     │
├─────────────────────────────────────────────────────────────────┤
│ + getCategories(): Promise<Category[]>                           │
│ + getCategoryById(id): Promise<Category | null>                  │
│ + getCategoryBySlug(slug): Promise<Category | null>             │
│ + getRootCategories(): Promise<Category[]>                       │
│ + getSubcategories(parentId): Promise<Category[]>               │
│ + createCategory(data): Promise<Category>      [Admin only]     │
│ + updateCategory(id, updates): Promise<Category> [Admin only]   │
│ + deleteCategory(id): Promise<void>             [Admin only]   │
│ + reorderCategories(ids: string[]): Promise<void> [Admin only] │
└─────────────────────────────────────────────────────────────────┘
```

**Quy tắc nghiệp vụ:**
- Danh mục có thể có danh mục con (parentId self-reference)
- `sortOrder` xác định thứ tự hiển thị
- `isActive = false` không hiển thị danh mục nhưng không xóa dữ liệu

---

### 3.4 LỚP GIỎ HÀNG (Cart / CartItem)

```typescript
┌─────────────────────────────────────────────────────────────────┐
│                          «entity»                                │
│                          <<Cart>>                                │
├─────────────────────────────────────────────────────────────────┤
│ - id: string                    [PK]                            │
│ - userId?: string               [FK → User, nullable]           │
│ - tableId?: string              [FK → Table, nullable]          │
│ - items: CartItem[]             [embedded]                       │
│ - subtotal: number              [computed]                       │
│ - tax: number                   [computed: subtotal * 10%]      │
│ - discount: number              [DEFAULT: 0]                    │
│ - total: number                 [computed: subtotal + tax - discount]│
│ - couponCode?: string                                           │
│ - createdAt: Date               [DEFAULT: now]                  │
│ - updatedAt: Date               [auto-update]                   │
├─────────────────────────────────────────────────────────────────┤
│ + getCart(userId?, tableId?): Promise<Cart>                      │
│ + addToCart(productId, quantity, notes?): Promise<Cart>         │
│ + updateCartItem(cartItemId, quantity, notes?): Promise<Cart>   │
│ + removeFromCart(cartItemId): Promise<Cart>                     │
│ + clearCart(): Promise<Cart>                                    │
│ + applyCoupon(couponCode): Promise<Cart>                        │
│ + removeCoupon(): Promise<Cart>                                 │
│ + getItemCount(): number                                        │
│ + getSubtotal(): number                                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       <<CartItem>>                               │
├─────────────────────────────────────────────────────────────────┤
│ - id: string                    [PK]                            │
│ - productId: string             [FK → Product]                   │
│ - product: Product              [embedded / referenced]          │
│ - quantity: number              [NOT NULL, min: 1]               │
│ - price: number                 [NOT NULL]                      │
│ - notes?: string                                                │
└─────────────────────────────────────────────────────────────────┘
```

**Quy tắc nghiệp vụ:**
- Cart được gắn với `userId` (đặt hàng online) HOẶC `tableId` (đặt tại bàn QR)
- Không thể đồng thời có cả userId và tableId
- Thuế (VAT) luôn là 10% của subtotal
- `discount` có thể đến từ mã giảm giá (coupon)
- `total = subtotal + tax - discount`
- Khi thêm sản phẩm đã có trong giỏ → tăng quantity thay vì tạo item mới

---

### 3.5 LỚP ĐƠN HÀNG (Order / OrderItem)

```typescript
┌─────────────────────────────────────────────────────────────────┐
│                          «entity»                                │
│                          <<Order>>                               │
├─────────────────────────────────────────────────────────────────┤
│ - id: string                    [PK]                            │
│ - orderNumber: string           [UQ, auto-gen: "ORD-YYYYMMDD-XXX"]│
│ - userId: string                [FK → User]                     │
│ - userName: string              [denormalized]                   │
│ - userPhone: string             [denormalized]                   │
│ - userEmail: string             [denormalized]                  │
│ - deliveryAddress?: string                                       │
│ - tableId?: string              [FK → Table, nullable]           │
│ - tableName?: string            [denormalized]                   │
│ - items: OrderItem[]            [embedded]                       │
│ - subtotal: number                                              │
│ - tax: number                                                   │
│ - discount: number              [DEFAULT: 0]                     │
│ - deliveryFee: number           [DEFAULT: 15000]                 │
│ - total: number                                                 │
│ - paymentMethod: PaymentMethod ['cod', 'vnpay']                 │
│ - paymentStatus: PaymentStatus ['pending', 'paid', 'failed', 'refunded']│
│ - orderStatus: OrderStatus     ['pending', 'confirmed', 'preparing',│
│                               'ready', 'delivering', 'delivered',│
│                               'completed', 'cancelled']         │
│ - notes?: string                                                │
│ - estimatedDeliveryTime?: string                                 │
│ - cancelledAt?: Date                                            │
│ - cancelledReason?: string                                      │
│ - createdAt: Date               [DEFAULT: now]                   │
│ - updatedAt: Date              [auto-update]                     │
├─────────────────────────────────────────────────────────────────┤
│ + createOrder(data): Promise<Order>                             │
│ + getOrders(userId?): Promise<Order[]>                          │
│ + getOrderById(orderId): Promise<Order | null>                   │
│ + getOrdersByStatus(status): Promise<Order[]>                   │
│ + getAllOrders(): Promise<Order[]>            [Admin only]      │
│ + updateOrderStatus(orderId, status): Promise<Order> [Admin]    │
│ + cancelOrder(orderId, reason?): Promise<Order>                  │
│ + getOrderStats(): Promise<OrderStats>      [Admin only]        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       <<OrderItem>>                              │
├─────────────────────────────────────────────────────────────────┤
│ - productId: string             [FK → Product]                   │
│ - productName: string           [denormalized]                   │
│ - productImage: string          [denormalized]                   │
│ - price: number                 [NOT NULL]                      │
│ - quantity: number              [NOT NULL, min: 1]               │
│ - notes?: string                                                │
│ - subtotal: number              [computed: price * quantity]     │
└─────────────────────────────────────────────────────────────────┘
```

**Quy tắc nghiệp vụ:**
- `orderNumber` tự động tạo theo format: `ORD-YYYYMMDD-XXX` (ví dụ: ORD-20260319-001)
- Khi đặt hàng tại bàn (tableId) → không cần deliveryAddress
- Khi đặt hàng online (userId) → có thể có deliveryAddress
- **Lifecycle trạng thái đơn hàng:**
  ```
  pending → confirmed → preparing → ready → delivering → delivered → completed
                                       ↘ (tại bàn: ready → delivered)
  pending ────────────────────────────────────────────────────→ cancelled
  ```
- Chỉ có thể hủy khi status là `pending` hoặc `confirmed`
- Thanh toán VNPay cần `paymentStatus = paid` trước khi xác nhận đơn
- Đơn hàng lưu trữ thông tin sản phẩm dạng denormalized (snapshot) để không phụ thuộc vào dữ liệu sản phẩm hiện tại

---

### 3.6 LỚP THANH TOÁN (Payment)

```typescript
┌─────────────────────────────────────────────────────────────────┐
│                          «entity»                                │
│                         <<Payment>>                              │
├─────────────────────────────────────────────────────────────────┤
│ - id: string                    [PK]                            │
│ - orderId: string                [FK → Order, UQ]                │
│ - amount: number                [NOT NULL]                       │
│ - method: PaymentMethod         ['cod', 'vnpay']                 │
│ - status: PaymentStatus         ['pending', 'paid', 'failed', 'refunded']│
│ - transactionId?: string         [from VNPay]                     │
│ - paymentUrl?: string            [VNPay payment URL]             │
│ - voucherCode?: string                                           │
│ - createdAt: Date               [DEFAULT: now]                   │
│ - paidAt?: Date                                                 │
│ - refundedAt?: Date                                              │
├─────────────────────────────────────────────────────────────────┤
│ + createPayment(orderId, method): Promise<Payment>               │
│ + verifyPayment(orderId, transactionId?): Promise<Payment>        │
│ + refundPayment(orderId): Promise<Payment>        [Admin only]  │
│ + getPaymentByOrder(orderId): Promise<Payment | null>            │
│ + getPaymentUrl(orderId): Promise<string>                       │
└─────────────────────────────────────────────────────────────────┘
```

**Quy tắc nghiệp vụ:**
- Mỗi đơn hàng có tối đa 1 payment
- VNPay: tạo payment với status `pending`, sau khi thanh toán thành công → `paid`
- COD: payment được tạo với status `paid` ngay khi đơn được xác nhận
- Refund chỉ áp dụng khi đơn đã paid và chưa deliver
- `paymentUrl` dùng để redirect user đến trang thanh toán VNPay

---

### 3.7 LỚP ĐÁNH GIÁ (Review)

```typescript
┌─────────────────────────────────────────────────────────────────┐
│                          «entity»                                │
│                         <<Review>>                               │
├─────────────────────────────────────────────────────────────────┤
│ - id: string                    [PK]                            │
│ - productId: string             [FK → Product]                   │
│ - userId: string                [FK → User]                     │
│ - userName: string              [denormalized]                   │
│ - userAvatar?: string           [denormalized]                   │
│ - rating: number                [NOT NULL, 1-5]                   │
│ - title?: string                                                 │
│ - content: string               [NOT NULL]                       │
│ - images?: string[]                                             │
│ - isVerified: boolean           [DEFAULT: false]                 │
│ - helpful: number               [DEFAULT: 0]                     │
│ - createdAt: Date               [DEFAULT: now]                   │
│ - updatedAt: Date              [auto-update]                     │
├─────────────────────────────────────────────────────────────────┤
│ + getReviewsByProduct(productId): Promise<Review[]>              │
│ + getReviewById(id): Promise<Review | null>                      │
│ + addReview(data, userId): Promise<Review>                      │
│ + markHelpful(reviewId): Promise<void>                          │
│ + deleteReview(id): Promise<void>              [Admin only]    │
│ + getAverageRating(productId): Promise<number>                  │
│ + getTotalReviews(productId): Promise<number>                   │
└─────────────────────────────────────────────────────────────────┘
```

**Quy tắc nghiệp vụ:**
- Rating từ 1 đến 5 sao
- Mỗi user chỉ được đánh giá 1 lần cho 1 sản phẩm
- `isVerified = true` khi user đã mua và nhận hàng thành công
- `helpful` là số lượng người thấy đánh giá hữu ích
- Khi có review mới → cập nhật lại rating và reviewCount của Product

---

### 3.8 LỚP BÀN (Table) - QR Ordering

```typescript
┌─────────────────────────────────────────────────────────────────┐
│                          «entity»                                │
│                          <<Table>>                               │
├─────────────────────────────────────────────────────────────────┤
│ - id: string                    [PK]                            │
│ - number: string                [NOT NULL]                      │
│ - qrCode: string                [UQ]                            │
│ - capacity: number              [DEFAULT: 4]                     │
│ - status: TableStatus           ['available', 'occupied', 'reserved']│
│ - location: string                                               │
│ - floor: number                 [DEFAULT: 1]                     │
│ - createdAt: Date               [DEFAULT: now]                   │
│ - updatedAt: Date              [auto-update]                     │
├─────────────────────────────────────────────────────────────────┤
│ + getTables(): Promise<Table[]>                                  │
│ + getTableById(id): Promise<Table | null>                        │
│ + getTableByQrCode(qrCode): Promise<Table | null>                │
│ + getAvailableTables(): Promise<Table[]>                         │
│ + getTablesByLocation(location): Promise<Table[]>                │
│ + updateTableStatus(id, status): Promise<Table> [Admin only]   │
│ + createTable(data): Promise<Table>           [Admin only]     │
│ + updateTable(id, updates): Promise<Table>     [Admin only]   │
│ + deleteTable(id): Promise<void>               [Admin only]   │
└─────────────────────────────────────────────────────────────────┘
```

**Quy tắc nghiệp vụ:**
- Mỗi bàn có 1 QR Code duy nhất → ghép với URL `/table/:tableId`
- Khi khách quét QR → tạo session với `tableId`, có thể đặt món trực tiếp
- `status`:
  - `available`: bàn trống, có thể đặt
  - `occupied`: đang có khách đặt món
  - `reserved`: đã được đặt trước

---

### 3.9 LỚP ĐỊA CHỈ (Address)

```typescript
┌─────────────────────────────────────────────────────────────────┐
│                          «entity»                                │
│                        <<Address>>                               │
├─────────────────────────────────────────────────────────────────┤
│ - id: string                    [PK]                            │
│ - userId: string                [FK → User]                     │
│ - name: string                  [NOT NULL]                      │
│ - phone: string                 [NOT NULL]                      │
│ - address: string               [NOT NULL]                      │
│ - city: string                  [NOT NULL]                      │
│ - district: string              [NOT NULL]                      │
│ - ward: string                                                  │
│ - label?: string                ['Nhà riêng', 'Cơ quan', ...]   │
│ - isDefault: boolean           [DEFAULT: false]                  │
│ - createdAt: Date               [DEFAULT: now]                   │
│ - updatedAt: Date              [auto-update]                    │
├─────────────────────────────────────────────────────────────────┤
│ + getAddresses(userId): Promise<Address[]>                     │
│ + addAddress(userId, data): Promise<Address>                   │
│ + updateAddress(id, data): Promise<Address>                     │
│ + deleteAddress(id): Promise<void>                              │
│ + setDefaultAddress(id): Promise<void>                          │
│ + getDefaultAddress(userId): Promise<Address | null>             │
└─────────────────────────────────────────────────────────────────┘
```

**Quy tắc nghiệp vụ:**
- Mỗi user có thể có nhiều địa chỉ giao hàng
- Chỉ có 1 địa chỉ mặc định (`isDefault = true`) per user
- Khi set địa chỉ mới làm mặc định → địa chỉ cũ tự động unset
- `label` giúp user phân biệt (ví dụ: "Nhà riêng", "Cơ quan")

---

### 3.10 LỚP MÃ GIẢM GIÁ (Coupon)

```typescript
┌─────────────────────────────────────────────────────────────────┐
│                          «entity»                                │
│                         <<Coupon>>                               │
├─────────────────────────────────────────────────────────────────┤
│ - id: string                    [PK]                            │
│ - code: string                  [UQ, NOT NULL]                  │
│ - name: string                                                  │
│ - type: CouponType              ['percent', 'fixed']             │
│ - value: number                [NOT NULL]                       │
│ - maxDiscount?: number          [cho type='percent']             │
│ - minOrderValue?: number        [DEFAULT: 0]                     │
│ - usageLimit?: number                                          │
│ - usedCount: number             [DEFAULT: 0]                    │
│ - startDate: Date              [NOT NULL]                       │
│ - endDate: Date                [NOT NULL]                        │
│ - isActive: boolean            [DEFAULT: true]                  │
│ - createdAt: Date               [DEFAULT: now]                   │
│ - updatedAt: Date              [auto-update]                    │
├─────────────────────────────────────────────────────────────────┤
│ + getCoupon(code): Promise<Coupon | null>                        │
│ + validateCoupon(code, orderValue): Promise<ValidationResult>     │
│ + applyCoupon(code): Promise<Coupon>                             │
│ + createCoupon(data): Promise<Coupon>        [Admin only]       │
│ + updateCoupon(id, updates): Promise<Coupon> [Admin only]       │
│ + deleteCoupon(id): Promise<void>               [Admin only]   │
└─────────────────────────────────────────────────────────────────┘
```

**Quy tắc nghiệp vụ:**
- `type = 'percent'`: giảm theo % (ví dụ: 10% off, tối đa 30.000đ)
- `type = 'fixed'`: giảm số tiền cố định (ví dụ: giảm 20.000đ)
- Coupon có hiệu lực trong khoảng `startDate` đến `endDate`
- `usageLimit` giới hạn số lần sử dụng (null = không giới hạn)
- Khi `usedCount >= usageLimit` → coupon không còn khả dụng

---

### 3.11 LỚP THỐNG KÊ (AdminStats)

```typescript
┌─────────────────────────────────────────────────────────────────┐
│                          «entity»                                │
│                      <<AdminStats>>                              │
├─────────────────────────────────────────────────────────────────┤
│ - totalRevenue: number                                          │
│ - todayRevenue: number                                          │
│ - totalOrders: number                                           │
│ - todayOrders: number                                           │
│ - totalUsers: number                                           │
│ - newUsersToday: number                                         │
│ - totalProducts: number                                         │
│ - lowStockProducts: number        [stock < 10]                  │
│ - pendingOrders: number                                          │
│ - completedOrders: number                                        │
│ - cancelledOrders: number                                        │
│ - topProducts: Product[]         [top 10 best sellers]           │
│ - recentOrders: Order[]          [top 10 newest]                 │
│ - revenueByDay: RevenueDay[]                                    │
│ - revenueByMonth: RevenueMonth[]                                 │
├─────────────────────────────────────────────────────────────────┤
│ + getDashboardStats(): Promise<AdminStats>                      │
│ + getRevenueStats(period): Promise<RevenueStats>                 │
│ + getTopProducts(limit): Promise<Product[]>                     │
│ + getLowStockProducts(): Promise<Product[]>                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. BIỂU ĐỒ QUAN HỆ GIỮA CÁC LỚP

```
                                    ┌─────────────┐
                                    │  Category   │
                                    └──────┬──────┘
                                           │ 1
                                           │ :N
┌─────────┐     1:N    ┌─────────────┐     │  ┌─────────────┐
│  User   │────────────│    Cart     │     └──│   Product   │
└────┬────┘            └──────┬──────┘        └──────┬──────┘
     │ 1:N                     │ :1                    │ 1:N
     │                         │                        │
     │ N                       │ N                      │ N
┌────┴────┐               ┌─────┴────┐             ┌────┴────┐
│Address  │               │ CartItem │             │ Review │
└─────────┘               └──────────┘             └────────┘

┌─────────┐     1:1    ┌─────────────┐     N:1   ┌─────────────┐
│  User   │────────────│    Order    │────────────│    Table    │
└────┬────┘            └──────┬──────┘            └─────────────┘
     │ 1:N                    │ 1:1
     │                         │
     │ N                  ┌─────┴────┐
┌────┴────┐               │ Payment  │
│ Review  │               └──────────┘
└─────────┘
```

---

## 5. MÔ TẢ CHI TIẾT THUỘC TÍNH TỪNG LỚP

### 5.1 User

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|---------------|--------------|----------|-------|
| 1 | id | string | PK, auto | ID duy nhất của người dùng |
| 2 | email | string | UQ, NOT NULL | Email đăng nhập |
| 3 | password | string | NOT NULL | Mật khẩu đã hash (bcrypt) |
| 4 | name | string | NOT NULL | Họ tên đầy đủ |
| 5 | phone | string | NOT NULL | Số điện thoại |
| 6 | avatar | string | optional | URL ảnh đại diện |
| 7 | role | enum | DEFAULT: 'user' | 'user' = khách hàng, 'admin' = quản trị |
| 8 | isVerified | boolean | DEFAULT: false | Đã xác thực email chưa |
| 9 | createdAt | Date | auto | Ngày tạo tài khoản |
| 10 | updatedAt | Date | auto | Ngày cập nhật gần nhất |
| 11 | address | string | optional | Địa chỉ mặc định |

### 5.2 Product

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|---------------|--------------|----------|-------|
| 1 | id | string | PK, auto | ID sản phẩm |
| 2 | name | string | NOT NULL | Tên sản phẩm |
| 3 | slug | string | UQ | Slug URL-friendly |
| 4 | description | string | | Mô tả chi tiết |
| 5 | price | number | NOT NULL, >= 0 | Giá bán (VND) |
| 6 | originalPrice | number | >= 0 | Giá gốc (trước giảm) |
| 7 | images | string[] | min: 1 | Danh sách URL hình ảnh |
| 8 | video | string | optional | URL video sản phẩm |
| 9 | categoryId | string | FK | ID danh mục |
| 10 | categoryName | string | | Tên danh mục (denormalized) |
| 11 | rating | number | 0-5 | Điểm đánh giá trung bình |
| 12 | reviewCount | number | >= 0 | Số lượng đánh giá |
| 13 | isAvailable | boolean | DEFAULT: true | Còn hàng không |
| 14 | isFeatured | boolean | DEFAULT: false | Hiển thị trang chủ |
| 15 | isNew | boolean | DEFAULT: false | Đánh dấu sản phẩm mới |
| 16 | preparationTime | number | DEFAULT: 15 | Thời gian chuẩn bị (phút) |
| 17 | calories | number | | Calories per serving |
| 18 | ingredients | string[] | | Danh sách nguyên liệu |
| 19 | allergens | string[] | | Các chất gây dị ứng |
| 20 | tags | string[] | | Tags phân loại |
| 21 | stock | number | >= 0 | Số lượng tồn kho |
| 22 | createdAt | Date | auto | Ngày tạo |
| 23 | updatedAt | Date | auto | Ngày cập nhật |

### 5.3 Order

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|---------------|--------------|----------|-------|
| 1 | id | string | PK, auto | ID đơn hàng |
| 2 | orderNumber | string | UQ, auto | Mã đơn hàng |
| 3 | userId | string | FK | ID khách hàng |
| 4 | userName | string | | Tên khách hàng |
| 5 | userPhone | string | | SĐT khách hàng |
| 6 | userEmail | string | | Email khách hàng |
| 7 | deliveryAddress | string | | Địa chỉ giao hàng |
| 8 | tableId | string | FK, nullable | ID bàn (QR ordering) |
| 9 | tableName | string | | Tên bàn |
| 10 | items | OrderItem[] | | Chi tiết món |
| 11 | subtotal | number | | Tổng tiền hàng |
| 12 | tax | number | | Thuế VAT 10% |
| 13 | discount | number | DEFAULT: 0 | Giảm giá |
| 14 | deliveryFee | number | DEFAULT: 15000 | Phí giao hàng |
| 15 | total | number | | Tổng cộng |
| 16 | paymentMethod | enum | | 'cod' hoặc 'vnpay' |
| 17 | paymentStatus | enum | | Trạng thái thanh toán |
| 18 | orderStatus | enum | | Trạng thái đơn hàng |
| 19 | notes | string | | Ghi chú đơn hàng |
| 20 | estimatedDeliveryTime | string | | Thời gian giao hàng dự kiến |
| 21 | cancelledAt | Date | | Thời gian hủy |
| 22 | cancelledReason | string | | Lý do hủy |
| 23 | createdAt | Date | auto | Ngày đặt |
| 24 | updatedAt | Date | auto | Ngày cập nhật |

### 5.4 Payment

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|---------------|--------------|----------|-------|
| 1 | id | string | PK, auto | ID thanh toán |
| 2 | orderId | string | FK, UQ | ID đơn hàng |
| 3 | amount | number | NOT NULL | Số tiền thanh toán |
| 4 | method | enum | | 'cod' hoặc 'vnpay' |
| 5 | status | enum | | pending/paid/failed/refunded |
| 6 | transactionId | string | | Mã giao dịch VNPay |
| 7 | paymentUrl | string | | URL thanh toán VNPay |
| 8 | voucherCode | string | | Mã voucher đã dùng |
| 9 | createdAt | Date | auto | Ngày tạo |
| 10 | paidAt | Date | | Ngày thanh toán thành công |
| 11 | refundedAt | Date | | Ngày hoàn tiền |

### 5.5 Review

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|---------------|--------------|----------|-------|
| 1 | id | string | PK, auto | ID đánh giá |
| 2 | productId | string | FK | ID sản phẩm |
| 3 | userId | string | FK | ID người dùng |
| 4 | userName | string | | Tên người dùng |
| 5 | userAvatar | string | | Avatar người dùng |
| 6 | rating | number | 1-5 | Số sao đánh giá |
| 7 | title | string | | Tiêu đề đánh giá |
| 8 | content | string | NOT NULL | Nội dung đánh giá |
| 9 | images | string[] | | Hình ảnh kèm theo |
| 10 | isVerified | boolean | | Đã mua sản phẩm |
| 11 | helpful | number | DEFAULT: 0 | Lượt thấy hữu ích |
| 12 | createdAt | Date | auto | Ngày đánh giá |
| 13 | updatedAt | Date | auto | Ngày cập nhật |

### 5.6 Category

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|---------------|--------------|----------|-------|
| 1 | id | string | PK, auto | ID danh mục |
| 2 | name | string | NOT NULL | Tên danh mục |
| 3 | slug | string | UQ | Slug URL |
| 4 | description | string | | Mô tả |
| 5 | image | string | | URL hình ảnh |
| 6 | parentId | string | FK, self | ID danh mục cha |
| 7 | isActive | boolean | DEFAULT: true | Hiển thị không |
| 8 | sortOrder | number | DEFAULT: 0 | Thứ tự |
| 9 | createdAt | Date | auto | Ngày tạo |
| 10 | updatedAt | Date | auto | Ngày cập nhật |

### 5.7 Cart / CartItem

**Cart:**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|---------------|--------------|----------|-------|
| 1 | id | string | PK, auto | ID giỏ hàng |
| 2 | userId | string | FK, nullable | ID user |
| 3 | tableId | string | FK, nullable | ID bàn |
| 4 | items | CartItem[] | | Danh sách món |
| 5 | subtotal | number | computed | Tổng tiền |
| 6 | tax | number | computed | Thuế 10% |
| 7 | discount | number | DEFAULT: 0 | Giảm giá |
| 8 | total | number | computed | Tổng cộng |
| 9 | couponCode | string | | Mã giảm giá |
| 10 | createdAt | Date | auto | Ngày tạo |
| 11 | updatedAt | Date | auto | Ngày cập nhật |

**CartItem:**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|---------------|--------------|----------|-------|
| 1 | id | string | PK, auto | ID item |
| 2 | productId | string | FK | ID sản phẩm |
| 3 | product | Product | embedded | Thông tin sản phẩm |
| 4 | quantity | number | min: 1 | Số lượng |
| 5 | price | number | NOT NULL | Giá tại thời điểm thêm |
| 6 | notes | string | | Ghi chú món |

### 5.8 Table

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|---------------|--------------|----------|-------|
| 1 | id | string | PK, auto | ID bàn |
| 2 | number | string | NOT NULL | Số bàn |
| 3 | qrCode | string | UQ | Mã QR |
| 4 | capacity | number | DEFAULT: 4 | Số người tối đa |
| 5 | status | enum | | available/occupied/reserved |
| 6 | location | string | | Vị trí bàn |
| 7 | floor | number | DEFAULT: 1 | Tầng |
| 8 | createdAt | Date | auto | Ngày tạo |
| 9 | updatedAt | Date | auto | Ngày cập nhật |

### 5.9 Address

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|---------------|--------------|----------|-------|
| 1 | id | string | PK, auto | ID địa chỉ |
| 2 | userId | string | FK | ID người dùng |
| 3 | name | string | NOT NULL | Tên người nhận |
| 4 | phone | string | NOT NULL | SĐT người nhận |
| 5 | address | string | NOT NULL | Địa chỉ chi tiết |
| 6 | city | string | NOT NULL | Thành phố |
| 7 | district | string | NOT NULL | Quận/Huyện |
| 8 | ward | string | | Phường/Xã |
| 9 | label | string | | Nhãn (Nhà riêng, Cơ quan) |
| 10 | isDefault | boolean | DEFAULT: false | Địa chỉ mặc định |
| 11 | createdAt | Date | auto | Ngày tạo |
| 12 | updatedAt | Date | auto | Ngày cập nhật |

### 5.10 Coupon

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|---------------|--------------|----------|-------|
| 1 | id | string | PK, auto | ID coupon |
| 2 | code | string | UQ, NOT NULL | Mã coupon |
| 3 | name | string | | Tên khuyến mãi |
| 4 | type | enum | | 'percent' hoặc 'fixed' |
| 5 | value | number | NOT NULL | Giá trị giảm |
| 6 | maxDiscount | number | | Tối đa giảm (% mode) |
| 7 | minOrderValue | number | DEFAULT: 0 | Đơn tối thiểu |
| 8 | usageLimit | number | | Giới hạn sử dụng |
| 9 | usedCount | number | DEFAULT: 0 | Đã sử dụng |
| 10 | startDate | Date | NOT NULL | Ngày bắt đầu |
| 11 | endDate | Date | NOT NULL | Ngày kết thúc |
| 12 | isActive | boolean | DEFAULT: true | Còn hiệu lực |
| 13 | createdAt | Date | auto | Ngày tạo |
| 14 | updatedAt | Date | auto | Ngày cập nhật |

---

## 6. SƠ ĐỒ MÔ HÌNH MVC TRONG FRONTEND

### 6.1 Cấu trúc Frontend (React + Redux)

```
frontend/src/
│
├── types/index.ts          ← MODEL: TypeScript Interfaces & Types
│
├── store/                  ← CONTROLLER: Redux Slices (Business Logic)
│   ├── index.ts
│   └── slices/
│       ├── authSlice.ts     ← Auth business logic
│       ├── cartSlice.ts      ← Cart/Ordering logic
│       ├── productSlice.ts   ← Product filtering/sorting logic
│       ├── orderSlice.ts     ← Order management logic
│       └── categorySlice.ts  ← Category logic
│
├── services/               ← SERVICE LAYER: API calls
│   ├── api.ts
│   └── endpoints/
│       ├── auth.ts, product.ts, cart.ts, order.ts,
│       ├── payment.ts, table.ts, user.ts
│
├── components/             ← VIEW: React Components
│   ├── layout/
│   ├── common/
│   └── features/
│
└── pages/                  ← VIEW: Page Components
    ├── Home/
    ├── Products/
    ├── Cart/
    ├── Checkout/
    ├── Auth/
    ├── Profile/
    ├── QRPage/
    ├── Admin/
    ├── Contact/
    └── Policy/
```

### 6.2 Mối quan hệ Redux Store ↔ Backend API

```
Component (VIEW)
    │ dispatch(action)
    ▼
Redux Slice (CONTROLLER)
    │ asyncThunk(apiFunction)
    ▼
API Service (SERVICE LAYER)
    │ axios.get/post/put/delete
    ▼
Backend Controller
    │ controller.function()
    ▼
Database (MODEL)
```

---

## 7. CÁC ENUM VÀ KIỂU DỮ LIỆU ĐỊNH NGHĨA

```typescript
// User Role
enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

// Order Status
enum OrderStatus {
  PENDING = 'pending',          // Chờ xác nhận
  CONFIRMED = 'confirmed',      // Đã xác nhận
  PREPARING = 'preparing',      // Đang chuẩn bị
  READY = 'ready',              // Sẵn sàng giao
  DELIVERING = 'delivering',    // Đang giao
  DELIVERED = 'delivered',      // Đã giao
  COMPLETED = 'completed',      // Hoàn thành
  CANCELLED = 'cancelled'       // Đã hủy
}

// Payment Method
enum PaymentMethod {
  COD = 'cod',                  // Thanh toán khi nhận hàng
  VNPAY = 'vnpay'               // Thanh toán qua VNPay
}

// Payment Status
enum PaymentStatus {
  PENDING = 'pending',          // Chờ thanh toán
  PAID = 'paid',                // Đã thanh toán
  FAILED = 'failed',            // Thanh toán thất bại
  REFUNDED = 'refunded'         // Đã hoàn tiền
}

// Table Status
enum TableStatus {
  AVAILABLE = 'available',      // Trống
  OCCUPIED = 'occupied',         // Đang có khách
  RESERVED = 'reserved'         // Đã đặt trước
}

// Coupon Type
enum CouponType {
  PERCENT = 'percent',          // Giảm theo %
  FIXED = 'fixed'               // Giảm số tiền cố định
}

// Toast Type
enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}
```

---

## 8. SƠ ĐỒ PACKAGE/THƯ MỤC BACKEND (DỰ KIẾN)

```
backend/src/
│
├── config/                  ← Cấu hình
│   ├── database.ts          ← Kết nối MongoDB
│   ├── env.ts               ← Environment variables
│   └── cors.ts              ← CORS config
│
├── models/                  ← MODEL LAYER (MongoDB Schemas)
│   ├── User.ts
│   ├── Product.ts
│   ├── Category.ts
│   ├── Cart.ts
│   ├── CartItem.ts
│   ├── Order.ts
│   ├── OrderItem.ts
│   ├── Payment.ts
│   ├── Review.ts
│   ├── Table.ts
│   ├── Address.ts
│   ├── Coupon.ts
│   └── index.ts
│
├── controllers/             ← CONTROLLER LAYER
│   ├── authController.ts
│   ├── productController.ts
│   ├── categoryController.ts
│   ├── cartController.ts
│   ├── orderController.ts
│   ├── paymentController.ts
│   ├── reviewController.ts
│   ├── tableController.ts
│   ├── userController.ts
│   └── adminController.ts
│
├── routes/                  ← ROUTING
│   ├── auth.routes.ts
│   ├── product.routes.ts
│   ├── category.routes.ts
│   ├── cart.routes.ts
│   ├── order.routes.ts
│   ├── payment.routes.ts
│   ├── review.routes.ts
│   ├── table.routes.ts
│   ├── user.routes.ts
│   └── admin.routes.ts
│
├── middleware/              ← MIDDLEWARE
│   ├── auth.middleware.ts   ← JWT verification
│   ├── admin.middleware.ts  ← Admin role check
│   ├── upload.middleware.ts  ← File upload (Multer)
│   ├── validate.middleware.ts← Request validation
│   ├── error.middleware.ts  ← Error handling
│   └── rateLimit.middleware.ts
│
├── services/                ← BUSINESS LOGIC LAYER
│   ├── authService.ts
│   ├── productService.ts
│   ├── orderService.ts
│   ├── paymentService.ts    ← VNPay integration
│   ├── emailService.ts      ← SendGrid / Nodemailer
│   ├── qrService.ts         ← QR Code generation
│   └── couponService.ts
│
├── utils/                   ← UTILITIES
│   ├── ApiResponse.ts
│   ├── generateToken.ts
│   ├── hashPassword.ts
│   ├── slugify.ts
│   └── formatDate.ts
│
├── validators/              ← REQUEST VALIDATION (Joi/Zod)
│   ├── auth.validator.ts
│   ├── product.validator.ts
│   ├── order.validator.ts
│   └── cart.validator.ts
│
└── app.ts                   ← Express App Entry
```

---

## 9. BẢNG MÃ TRẠNG THÁI ĐƠN HÀNG

```
Trạng thái          │ Màu hiển thị │ Hành động có thể
────────────────────┼──────────────┼─────────────────────
pending             │ Vàng         │ Admin xác nhận, User hủy
confirmed           │ Xanh dương   │ Admin bắt đầu chuẩn bị
preparing           │ Cam          │ Admin đánh dấu xong
ready               │ Tím          │ Admin giao hàng
delivering          │ Xanh lá      │ Đang vận chuyển
delivered           │ Đen          │ User xác nhận đã nhận
completed           │ Xanh dương   │ Hoàn tất đơn
cancelled           │ Đỏ           │ Đơn đã hủy
```

---

## 10. QUY TẮC NGHIỆP VỤ TỔNG HỢP

1. **Đặt hàng**: User tạo đơn → thanh toán → xác nhận → chuẩn bị → giao → hoàn thành
2. **QR Ordering**: Khách quét QR → đặt món tại bàn → thanh toán → nhận món tại bàn
3. **Thanh toán VNPay**: Tạo payment pending → redirect VNPay → callback verify → cập nhật paid
4. **Thuế**: Luôn 10% VAT trên subtotal
5. **Giảm giá**: Áp dụng coupon hoặc khuyến mãi → giảm trừ vào discount
6. **Đánh giá**: Chỉ user đã mua mới đánh giá verified
7. **Quản lý tồn kho**: Khi đặt hàng → giảm stock. Hủy đơn → hoàn stock
8. **Chat**: Lưu tin nhắn gần nhất (20 tin) trong localStorage
9. **Xác thực email**: Mã 6 số, có thời hạn 5 phút
10. **Admin dashboard**: Thống kê theo thời gian thực

---

## 11. CÁC USE CASE CHÍNH

### 11.1 Đặt hàng online
1. User đăng nhập
2. Xem sản phẩm, tìm kiếm, lọc
3. Thêm vào giỏ hàng
4. Điều chỉnh số lượng, ghi chú
5. Chọn địa chỉ giao hàng
6. Chọn phương thức thanh toán
7. Đặt hàng → redirect VNPay (nếu chọn)
8. Xác nhận → cập nhật trạng thái
9. Nhận hàng → hoàn thành

### 11.2 Đặt hàng tại bàn (QR)
1. Khách quét QR trên bàn
2. Xem menu, đặt món
3. Thanh toán (COD hoặc VNPay)
4. Nhận món tại bàn

### 11.3 Quản lý đơn hàng (Admin)
1. Xem danh sách đơn hàng
2. Lọc theo trạng thái, ngày
3. Cập nhật trạng thái đơn hàng
4. Hủy đơn (có lý do)
5. Xem chi tiết đơn hàng

### 11.4 Đánh giá sản phẩm
1. User đã nhận hàng
2. Viết đánh giá + chọn sao
3. Upload hình ảnh (optional)
4. Submit → cập nhật rating sản phẩm
