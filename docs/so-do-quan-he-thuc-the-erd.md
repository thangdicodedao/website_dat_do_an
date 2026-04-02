# SƠ ĐỒ QUAN HỆ THỰC THỂ (ENTITY-RELATIONSHIP DIAGRAM)
## Hệ thống Website Đặt Đồ Ăn - Bình Bún Bò

---

## 1. TỔNG QUAN

### 1.1 Mô tả

Sơ đồ ERD (Entity-Relationship Diagram) mô tả cấu trúc cơ sở dữ liệu quan hệ của hệ thống website đặt đồ ăn Bình Bún Bò. Hệ thống sử dụng **MongoDB** (NoSQL) nhưng được thiết kế theo mô hình quan hệ để đảm bảo tính nhất quán dữ liệu.

### 1.2 Các thực thể chính

| # | Tên thực thể | Tiếng Việt | Số bảng |
|---|-------------|-----------|---------|
| 1 | User | Người dùng | 1 |
| 2 | Product | Sản phẩm | 1 |
| 3 | Category | Danh mục | 1 |
| 4 | Cart | Giỏ hàng | 1 |
| 5 | CartItem | Món trong giỏ | 1 (embedded) |
| 6 | Order | Đơn hàng | 1 |
| 7 | OrderItem | Món trong đơn | 1 (embedded) |
| 8 | Payment | Thanh toán | 1 |
| 9 | Review | Đánh giá | 1 |
| 10 | Table | Bàn (QR) | 1 |
| 11 | Address | Địa chỉ | 1 |
| 12 | Coupon | Mã giảm giá | 1 |

---

## 2. SƠ ĐỒ ERD CHI TIẾT

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SƠ ĐỒ QUAN HỆ THỰC THỂ                            │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │     Category      │
                    │   (Danh mục)     │
                    ├──────────────────┤
                    │ PK  id           │
                    │     name         │
                    │     slug         │
                    │     description  │
                    │     image        │
                    │ FK  parentId ────┼──┐
                    │     isActive     │  │
                    │     sortOrder    │  │
                    │     createdAt    │  │
                    │     updatedAt    │  │
                    └──────────────────┘  │
                           │              │
                           │ 1:N          │ Self-reference
                           ▼              │ (danh mục con)
                    ┌──────────────────┐  │
                    │     Product       │  │
                    │   (Sản phẩm)     │  │
                    ├──────────────────┤  │
                    │ PK  id           │  │
                    │     name         │◄─┘
                    │     slug         │
                    │     description │
                    │     price       │
                    │     originalPrice│
                    │     images[]     │
                    │     video        │
                    │ FK  categoryId  │───────┐
                    │     categoryName │
                    │     rating       │
                    │     reviewCount  │
                    │     isAvailable  │
                    │     isFeatured  │
                    │     isNew        │
                    │     preparationTime│
                    │     calories     │
                    │     ingredients[]│
                    │     allergens[]  │
                    │     tags[]       │
                    │     stock        │
                    │     createdAt    │
                    │     updatedAt    │
                    └──────────────────┘
                               │
                               │ 1:N
                               ▼
                    ┌──────────────────┐
                    │     Review        │
                    │   (Đánh giá)     │
                    ├──────────────────┤
                    │ PK  id           │
                    │ FK  productId    │───────┐
                    │ FK  userId       │───────┤
                    │     userName     │
                    │     userAvatar   │
                    │     rating       │
                    │     title        │
                    │     content      │
                    │     images[]     │
                    │     isVerified   │
                    │     helpful      │
                    │     createdAt    │
                    │     updatedAt    │
                    └──────────────────┘

    ┌───────────────────────────────────────────────────────────────────────┐
    │                              User                                     │
    │                         (Người dùng)                                  │
    ├───────────────────────────────────────────────────────────────────────┤
    │ PK  id           │ Mã định danh người dùng                           │
    │     email        │ Email đăng nhập (duy nhất)                        │
    │     password     │ Mật khẩu đã hash                                  │
    │     name         │ Họ tên                                            │
    │     phone        │ Số điện thoại                                     │
    │     avatar       │ URL ảnh đại diện                                  │
    │     role         │ 'user' | 'admin'                                  │
    │     isVerified   │ Đã xác thực email                                 │
    │     address      │ Địa chỉ mặc định                                 │
    │     createdAt    │ Ngày tạo tài khoản                               │
    │     updatedAt    │ Ngày cập nhật gần nhất                            │
    └───────────────────────────────────────────────────────────────────────┘
           │                    │                    │
           │ 1:N                 │ 1:N                │ 1:N
           ▼                    ▼                    ▼
    ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
    │   Address   │       │    Order    │       │    Cart     │
    │  (Địa chỉ)  │       │  (Đơn hàng) │       │ (Giỏ hàng) │
    ├─────────────┤       ├─────────────┤       ├─────────────┤
    │ PK  id      │       │ PK  id      │       │ PK  id      │
    │ FK  userId  │       │ FK  userId  │       │ FK  userId  │
    │     name    │       │ orderNumber │       │ FK  tableId │
    │     phone   │       │ userName    │       │  items[]    │
    │     address │       │ userPhone   │       │  subtotal   │
    │     city    │       │ userEmail   │       │  tax        │
    │     district│       │ deliveryAddr│       │  discount   │
    │     ward    │       │ FK tableId  │◄──────│  total      │
    │     label   │       │  items[]    │       │ couponCode │
    │ isDefault   │       │  subtotal   │       │  createdAt │
    │  createdAt  │       │  tax        │       │  updatedAt  │
    └─────────────┘       │  discount   │       └─────────────┘
                           │  deliveryFee│
                           │  total     │              │
                           │  paymentMethod             │ N:1
                           │  paymentStatus             ▼
                           │  orderStatus       ┌─────────────┐
                           │  notes             │  Payment    │
                           │  estimatedTime     │(Thanh toán) │
                           │  cancelledAt       ├─────────────┤
                           │  cancelledReason   │ PK  id      │
                           │  createdAt         │ FK  orderId │
                           │  updatedAt         │  amount     │
                           └───────────────────┤  method     │
                                                │  status     │
                                                │  transactionId
                                                │  paymentUrl │
                                                │  createdAt   │
                                                │  paidAt      │
                                                │  refundedAt  │
                                                └─────────────┘

              ┌──────────────────┐
              │      Table        │
              │   (Bàn - QR)      │
              ├──────────────────┤
              │ PK  id           │
              │     number       │
              │     qrCode       │
              │     capacity     │
              │     status       │
              │     location     │
              │     floor        │
              │     createdAt    │
              │     updatedAt    │
              └──────────────────┘

    ┌──────────────────┐
    │     Coupon        │
    │  (Mã giảm giá)    │
    ├──────────────────┤
    │ PK  id           │
    │     code         │
    │     name         │
    │     type         │
    │     value        │
    │     maxDiscount  │
    │     minOrderValue│
    │     usageLimit   │
    │     usedCount    │
    │     startDate    │
    │     endDate      │
    │     isActive     │
    │     createdAt    │
    │     updatedAt    │
    └──────────────────┘
```

---

## 3. MÔ TẢ CHI TIẾT TỪNG THỰC THỂ

### 3.1 THỰC THỂ USER (Người dùng)

```
┌─────────────────────────────────────────────────────────────────┐
│                           USER                                   │
├─────────────────────────────┬───────────────────────────────────┤
│ Tên cột                     │ Mô tả                             │
├─────────────────────────────┼───────────────────────────────────┤
│ id (PK)                     │ UUID - Mã định danh duy nhất      │
│ email (UQ, NOT NULL)        │ Email đăng nhập, duy nhất hệ thống│
│ password (NOT NULL)         │ Mật khẩu đã mã hóa bcrypt        │
│ name (NOT NULL)             │ Họ và tên đầy đủ                  │
│ phone (NOT NULL)            │ Số điện thoại liên hệ             │
│ avatar                      │ URL hình ảnh đại diện             │
│ role                        │ 'user' (khách) | 'admin' (quản trị)│
│ isVerified                  │ false (mới) | true (đã xác thực)   │
│ address                      │ Địa chỉ mặc định                 │
│ createdAt                    │ Timestamp tạo tài khoản          │
│ updatedAt                    │ Timestamp cập nhật gần nhất       │
└─────────────────────────────┴───────────────────────────────────┘
```

**Ràng buộc:**
- `email` UNIQUE: không trùng lặp
- `password`: hash bằng bcrypt (cost factor 10)
- `role`: mặc định là 'user'
- Khi xóa user → các Order, Review, Address, Cart liên quan cũng xóa (cascade)

**Quan hệ:**
```
User (1) ───< Order (N)      │ Một User có N Đơn hàng
User (1) ───< Address (N)    │ Một User có N Địa chỉ giao hàng
User (1) ───< Review (N)     │ Một User có N Đánh giá
User (1) ───< Cart (N)       │ Một User có N Giỏ hàng (theo thời gian)
```

---

### 3.2 THỰC THỂ PRODUCT (Sản phẩm)

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCT                                  │
├─────────────────────────────┬───────────────────────────────────┤
│ Tên cột                     │ Mô tả                             │
├─────────────────────────────┼───────────────────────────────────┤
│ id (PK)                     │ UUID - Mã sản phẩm                │
│ name (NOT NULL)             │ Tên sản phẩm                      │
│ slug (UQ)                   │ Slug URL-friendly, duy nhất       │
│ description                 │ Mô tả chi tiết sản phẩm           │
│ price (NOT NULL, >= 0)      │ Giá bán (VND)                     │
│ originalPrice               │ Giá gốc trước khi giảm            │
│ images[] (min: 1)           │ Mảng URL hình ảnh sản phẩm        │
│ video                       │ URL video giới thiệu              │
│ categoryId (FK)             │ FK → Category.id                  │
│ categoryName                │ Tên danh mục (denormalized)       │
│ rating (0-5, DEFAULT: 0)    │ Điểm đánh giá trung bình         │
│ reviewCount (DEFAULT: 0)     │ Tổng số đánh giá                 │
│ isAvailable (DEFAULT: true) │ Còn hàng | Hết hàng               │
│ isFeatured (DEFAULT: false) │ Hiển thị trên trang chủ           │
│ isNew (DEFAULT: false)      │ Đánh dấu sản phẩm mới            │
│ preparationTime (DEFAULT:15)│ Thời gian chuẩn bị (phút)        │
│ calories                    │ Calories per serving              │
│ ingredients[]               │ Danh sách nguyên liệu             │
│ allergens[]                  │ Các chất gây dị ứng              │
│ tags[]                       │ Tags phân loại bổ sung            │
│ stock (DEFAULT: 0)          │ Số lượng tồn kho                  │
│ createdAt                    │ Timestamp tạo sản phẩm           │
│ updatedAt                    │ Timestamp cập nhật gần nhất       │
└─────────────────────────────┴───────────────────────────────────┘
```

**Ràng buộc:**
- `slug` UNIQUE: đường dẫn URL không trùng
- `images[]`: tối thiểu 1 ảnh
- `price >= 0`
- `rating`: 0.0 đến 5.0
- `stock >= 0`
- Khi cập nhật `rating` hoặc `reviewCount` → trigger tự động tính lại từ bảng Review

**Quan hệ:**
```
Category (1) ───< Product (N)   │ Một Category có N Products
Product (1) ───< Review (N)     │ Một Product có N Reviews
Product (1) ───< CartItem (N)   │ Một Product xuất hiện trong N CartItems
Product (1) ───< OrderItem (N)  │ Một Product xuất hiện trong N OrderItems
```

---

### 3.3 THỰC THỂ CATEGORY (Danh mục)

```
┌─────────────────────────────────────────────────────────────────┐
│                         CATEGORY                                 │
├─────────────────────────────┬───────────────────────────────────┤
│ Tên cột                     │ Mô tả                             │
├─────────────────────────────┼───────────────────────────────────┤
│ id (PK)                     │ UUID - Mã danh mục                │
│ name (NOT NULL)             │ Tên danh mục                     │
│ slug (UQ)                   │ Slug URL-friendly, duy nhất      │
│ description                  │ Mô tả danh mục                   │
│ image                        │ URL hình ảnh danh mục             │
│ parentId (FK, self)         │ FK → Category.id (self-reference) │
│ isActive (DEFAULT: true)     │ Hiển thị | Ẩn                    │
│ sortOrder (DEFAULT: 0)       │ Thứ tự sắp xếp                   │
│ createdAt                    │ Timestamp tạo                     │
│ updatedAt                    │ Timestamp cập nhật gần nhất       │
└─────────────────────────────┴───────────────────────────────────┘
```

**Ràng buộc:**
- `slug` UNIQUE
- `parentId` là self-reference → cho phép danh mục đa cấp
- `parentId = null` → danh mục gốc (root)
- Khi xóa Category cha → các Category con và Product liên quan cần xử lý

**Quan hệ:**
```
Category (1) ───< Category (N)  │ Self-reference: danh mục cha - con
Category (1) ───< Product (N)   │ Một Category có N Products
```

---

### 3.4 THỰC THỂ CART (Giỏ hàng)

```
┌─────────────────────────────────────────────────────────────────┐
│                           CART                                   │
├─────────────────────────────┬───────────────────────────────────┤
│ Tên cột                     │ Mô tả                             │
├─────────────────────────────┼───────────────────────────────────┤
│ id (PK)                     │ UUID - Mã giỏ hàng                │
│ userId (FK, nullable)       │ FK → User.id (nếu đặt online)     │
│ tableId (FK, nullable)      │ FK → Table.id (nếu đặt tại bàn)  │
│ items[] (embedded)          │ Mảng CartItem                     │
│ subtotal                    │ Tổng tiền hàng (sum)              │
│ tax                         │ Thuế VAT 10%                      │
│ discount (DEFAULT: 0)      │ Số tiền giảm giá                  │
│ total                       │ Tổng cộng = subtotal + tax - disc│
│ couponCode                  │ Mã coupon đã áp dụng              │
│ createdAt                    │ Timestamp tạo giỏ hàng           │
│ updatedAt                    │ Timestamp cập nhật gần nhất       │
└─────────────────────────────┴───────────────────────────────────┘
```

**Quy tắc:**
- `userId` và `tableId` không đồng thời có giá trị (mutually exclusive)
- `subtotal` = SUM(item.price * item.quantity) cho tất cả items
- `tax` = subtotal * 0.1 (10% VAT)
- `total` = subtotal + tax - discount
- Khi items thay đổi → tự động tính lại subtotal, tax, total
- Mỗi User/Table chỉ có 1 Cart active tại một thời điểm

**Quan hệ:**
```
User (1) ───< Cart (N)         │ Một User có N Giỏ hàng
Table (1) ───< Cart (N)         │ Một Table có N Giỏ hàng (theo phiên)
Cart (1) ───< CartItem (N)     │ Một Cart có N CartItems
```

---

### 3.5 THỰC THỂ CARTITEM (Món trong giỏ - EMBEDDED)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CARTITEM (EMBEDDED)                      │
├─────────────────────────────┬───────────────────────────────────┤
│ Tên cột                     │ Mô tả                             │
├─────────────────────────────┼───────────────────────────────────┤
│ id (PK)                     │ UUID - Mã item                    │
│ productId (FK)              │ FK → Product.id                   │
│ product (embedded)          │ Thông tin sản phẩm (snapshot)      │
│ quantity (NOT NULL, >= 1)  │ Số lượng đặt                      │
│ price (NOT NULL)           │ Giá tại thời điểm thêm vào giỏ    │
│ notes                       │ Ghi chú cho món (vd: ít cay)      │
└─────────────────────────────┴───────────────────────────────────┘
```

**Quy tắc:**
- `product` được lưu dạng embedded snapshot (không reference trực tiếp)
- Khi thêm sản phẩm đã có trong giỏ → tăng quantity
- `price` là giá tại thời điểm thêm vào (không thay đổi theo sản phẩm gốc)
- Khi đặt hàng thành công → Cart và CartItems bị xóa

---

### 3.6 THỰC THỂ ORDER (Đơn hàng)

```
┌─────────────────────────────────────────────────────────────────┐
│                            ORDER                                 │
├─────────────────────────────┬───────────────────────────────────┤
│ Tên cột                     │ Mô tả                             │
├─────────────────────────────┼───────────────────────────────────┤
│ id (PK)                     │ UUID - Mã đơn hàng                │
│ orderNumber (UQ, auto)      │ Mã đơn hàng hiển thị             │
│                              │ Format: ORD-YYYYMMDD-XXX          │
│ userId (FK)                 │ FK → User.id                      │
│ userName                    │ Tên khách hàng (snapshot)         │
│ userPhone                   │ SĐT khách hàng (snapshot)         │
│ userEmail                   │ Email khách hàng (snapshot)        │
│ deliveryAddress             │ Địa chỉ giao hàng                │
│ tableId (FK, nullable)      │ FK → Table.id (QR ordering)       │
│ tableName                   │ Tên bàn (snapshot)               │
│ items[] (embedded)          │ Mảng OrderItem                   │
│ subtotal                    │ Tổng tiền hàng                   │
│ tax                         │ Thuế VAT 10%                      │
│ discount (DEFAULT: 0)      │ Giảm giá                         │
│ deliveryFee (DEFAULT:15000)│ Phí giao hàng                    │
│ total                       │ Tổng cộng                        │
│ paymentMethod               │ 'cod' | 'vnpay'                   │
│ paymentStatus               │ 'pending'|'paid'|'failed'|'refunded'│
│ orderStatus                 │ 'pending'|'confirmed'|'preparing'│
│                              │ 'ready'|'delivering'|'delivered'  │
│                              │ 'completed'|'cancelled'           │
│ notes                       │ Ghi chú đơn hàng                 │
│ estimatedDeliveryTime       │ Thời gian giao dự kiến           │
│ cancelledAt                  │ Timestamp hủy đơn                │
│ cancelledReason             │ Lý do hủy đơn                    │
│ createdAt                    │ Timestamp tạo đơn                │
│ updatedAt                    │ Timestamp cập nhật gần nhất       │
└─────────────────────────────┴───────────────────────────────────┘
```

**Ràng buộc:**
- `orderNumber` UNIQUE, auto-increment theo ngày
- `paymentStatus` và `orderStatus` là 2 trạng thái độc lập
- Khi orderStatus = 'cancelled' → `cancelledAt` và `cancelledReason` bắt buộc
- Khi đặt hàng thành công → giảm `stock` của các sản phẩm
- Khi hủy đơn → hoàn lại `stock`

**Quan hệ:**
```
User (1) ───< Order (N)         │ Một User có N Đơn hàng
Table (1) ───< Order (N)        │ Một Table có N Đơn hàng
Order (1) ───< Payment (1)      │ Một Order có 1 Payment
Order (1) ───< OrderItem (N)   │ Một Order có N OrderItems
```

---

### 3.7 THỰC THỂ ORDERITEM (Món trong đơn - EMBEDDED)

```
┌─────────────────────────────────────────────────────────────────┐
│                       ORDERITEM (EMBEDDED)                      │
├─────────────────────────────┬───────────────────────────────────┤
│ Tên cột                     │ Mô tả                             │
├─────────────────────────────┼───────────────────────────────────┤
│ productId (FK)              │ FK → Product.id                   │
│ productName                 │ Tên sản phẩm (snapshot)           │
│ productImage                │ URL ảnh sản phẩm (snapshot)       │
│ price (NOT NULL)           │ Giá tại thời điểm đặt            │
│ quantity (NOT NULL, >= 1)  │ Số lượng đặt                      │
│ notes                       │ Ghi chú cho món                   │
│ subtotal                    │ price * quantity                   │
└─────────────────────────────┴───────────────────────────────────┘
```

**Quy tắc:**
- Tất cả thông tin sản phẩm được lưu dạng **snapshot (denormalized)**
- `productName`, `productImage` không thay đổi khi sản phẩm gốc được sửa
- `price` là giá tại thời điểm đặt hàng
- `subtotal` = price * quantity

---

### 3.8 THỰC THỂ PAYMENT (Thanh toán)

```
┌─────────────────────────────────────────────────────────────────┐
│                          PAYMENT                                 │
├─────────────────────────────┬───────────────────────────────────┤
│ Tên cột                     │ Mô tả                             │
├─────────────────────────────┼───────────────────────────────────┤
│ id (PK)                     │ UUID - Mã thanh toán              │
│ orderId (FK, UQ)            │ FK → Order.id, UNIQUE             │
│ amount (NOT NULL)           │ Số tiền thanh toán               │
│ method                      │ 'cod' | 'vnpay'                   │
│ status                      │ 'pending'|'paid'|'failed'|'refunded'│
│ transactionId               │ Mã giao dịch từ VNPay             │
│ paymentUrl                 │ URL redirect thanh toán VNPay      │
│ voucherCode                 │ Mã voucher đã dùng                │
│ createdAt                    │ Timestamp tạo payment             │
│ paidAt                       │ Timestamp thanh toán thành công   │
│ refundedAt                   │ Timestamp hoàn tiền               │
└─────────────────────────────┴───────────────────────────────────┘
```

**Ràng buộc:**
- `orderId` UNIQUE → mỗi Order chỉ có 1 Payment
- Khi Payment status = 'paid' → Order paymentStatus cũng = 'paid'
- Khi Payment status = 'refunded' → Order paymentStatus = 'refunded'
- VNPay: `paymentUrl` chứa URL để redirect user

**Quan hệ:**
```
Order (1) ───< Payment (1)      │ Một Order có 1 Payment
```

---

### 3.9 THỰC THỂ REVIEW (Đánh giá)

```
┌─────────────────────────────────────────────────────────────────┐
│                           REVIEW                                 │
├─────────────────────────────┬───────────────────────────────────┤
│ Tên cột                     │ Mô tả                             │
├─────────────────────────────┼───────────────────────────────────┤
│ id (PK)                     │ UUID - Mã đánh giá                │
│ productId (FK)              │ FK → Product.id                  │
│ userId (FK)                 │ FK → User.id                      │
│ userName                    │ Tên user (snapshot)               │
│ userAvatar                  │ Avatar user (snapshot)             │
│ rating (NOT NULL, 1-5)      │ Số sao đánh giá                  │
│ title                        │ Tiêu đề đánh giá                 │
│ content (NOT NULL)          │ Nội dung đánh giá                 │
│ images[]                     │ Hình ảnh kèm theo                 │
│ isVerified (DEFAULT: false) │ Đã mua và nhận hàng thành công   │
│ helpful (DEFAULT: 0)        │ Lượt thấy hữu ích                 │
│ createdAt                    │ Timestamp tạo đánh giá            │
│ updatedAt                    │ Timestamp cập nhật gần nhất       │
└─────────────────────────────┴───────────────────────────────────┘
```

**Ràng buộc:**
- `(productId, userId)` UNIQUE → mỗi user chỉ đánh giá 1 lần / 1 sản phẩm
- `rating` từ 1 đến 5
- Khi thêm Review mới → trigger cập nhật Product.rating và Product.reviewCount
- Khi xóa Review → trigger cập nhật lại Product.rating và Product.reviewCount

**Quan hệ:**
```
Product (1) ───< Review (N)      │ Một Product có N Reviews
User (1) ───< Review (N)        │ Một User có N Reviews
```

---

### 3.10 THỰC THỂ TABLE (Bàn - QR Ordering)

```
┌─────────────────────────────────────────────────────────────────┐
│                           TABLE                                  │
├─────────────────────────────┬───────────────────────────────────┤
│ Tên cột                     │ Mô tả                             │
├─────────────────────────────┼───────────────────────────────────┤
│ id (PK)                     │ UUID - Mã bàn                    │
│ number (NOT NULL)           │ Số bàn (vd: "B01", "Tầng 2 - 5") │
│ qrCode (UQ)                 │ Mã QR code, duy nhất              │
│ capacity (DEFAULT: 4)      │ Số người tối đa                   │
│ status                      │ 'available'|'occupied'|'reserved'   │
│ location                    │ Mô tả vị trí bàn                  │
│ floor (DEFAULT: 1)         │ Tầng                              │
│ createdAt                    │ Timestamp tạo bàn                 │
│ updatedAt                    │ Timestamp cập nhật gần nhất       │
└─────────────────────────────┴───────────────────────────────────┘
```

**Quy tắc:**
- `qrCode` UNIQUE: mỗi bàn có 1 QR code riêng
- QR code chứa URL: `{base_url}/table/{id}`
- `status` tự động cập nhật:
  - Khi có đơn hàng mới: available → occupied
  - Khi đơn hoàn thành/hủy: occupied → available

**Quan hệ:**
```
Table (1) ───< Cart (N)         │ Một Table có N Giỏ hàng (theo phiên)
Table (1) ───< Order (N)        │ Một Table có N Đơn hàng (QR)
```

---

### 3.11 THỰC THỂ ADDRESS (Địa chỉ)

```
┌─────────────────────────────────────────────────────────────────┐
│                          ADDRESS                                 │
├─────────────────────────────┬───────────────────────────────────┤
│ Tên cột                     │ Mô tả                             │
├─────────────────────────────┼───────────────────────────────────┤
│ id (PK)                     │ UUID - Mã địa chỉ                 │
│ userId (FK)                 │ FK → User.id                      │
│ name (NOT NULL)             │ Tên người nhận                    │
│ phone (NOT NULL)            │ SĐT người nhận                    │
│ address (NOT NULL)           │ Địa chỉ chi tiết (số nhà, đường) │
│ city (NOT NULL)              │ Thành phố                          │
│ district (NOT NULL)          │ Quận/Huyện                        │
│ ward                         │ Phường/Xã                         │
│ label                        │ Nhãn: 'Nhà riêng' | 'Cơ quan'...  │
│ isDefault (DEFAULT: false)  │ Địa chỉ mặc định                 │
│ createdAt                    │ Timestamp tạo                     │
│ updatedAt                    │ Timestamp cập nhật gần nhất       │
└─────────────────────────────┴───────────────────────────────────┘
```

**Quy tắc:**
- Khi `isDefault = true` cho address mới → tất cả address khác của user tự động `isDefault = false`
- Mỗi User có tối đa 1 địa chỉ mặc định
- Khi xóa User → xóa tất cả Address liên quan (cascade)

**Quan hệ:**
```
User (1) ───< Address (N)       │ Một User có N Địa chỉ
```

---

### 3.12 THỰC THỂ COUPON (Mã giảm giá)

```
┌─────────────────────────────────────────────────────────────────┐
│                          COUPON                                  │
├─────────────────────────────┬───────────────────────────────────┤
│ Tên cột                     │ Mô tả                             │
├─────────────────────────────┼───────────────────────────────────┤
│ id (PK)                     │ UUID - Mã coupon                  │
│ code (UQ, NOT NULL)         │ Mã coupon, DUY NHẤT              │
│ name                        │ Tên khuyến mãi                    │
│ type                        │ 'percent' | 'fixed'                │
│ value (NOT NULL)            │ Giá trị giảm (% hoặc số tiền)     │
│ maxDiscount                  │ Giới hạn giảm tối đa (type=% )   │
│ minOrderValue (DEFAULT: 0) │ Đơn hàng tối thiểu để áp dụng    │
│ usageLimit                  │ Số lần sử dụng tối đa (null=∞)   │
│ usedCount (DEFAULT: 0)     │ Số lần đã sử dụng                │
│ startDate (NOT NULL)        │ Ngày bắt đầu hiệu lực            │
│ endDate (NOT NULL)          │ Ngày kết thúc hiệu lực           │
│ isActive (DEFAULT: true)   │ Còn active hay đã bị vô hiệu     │
│ createdAt                    │ Timestamp tạo                    │
│ updatedAt                    │ Timestamp cập nhật gần nhất       │
└─────────────────────────────┴───────────────────────────────────┘
```

**Quy tắc:**
- `code` UNIQUE, không phân biệt hoa thường
- `type = 'percent'`: giảm theo % (ví dụ: 10%, max 30.000đ)
- `type = 'fixed'`: giảm số tiền cố định (ví dụ: 20.000đ)
- Coupon hết hạn khi `endDate < now()` hoặc `usedCount >= usageLimit`
- Coupon vô hiệu khi `isActive = false`

---

## 4. MA TRẬN QUAN HỆ GIỮA CÁC THỰC THỂ

| Entity 1 | Relationship | Entity 2 | Loại | Mô tả |
|---------|-------------|---------|------|-------|
| User | has | Address | 1:N | Mỗi user có nhiều địa chỉ |
| User | has | Order | 1:N | Mỗi user có nhiều đơn hàng |
| User | has | Cart | 1:N | Mỗi user có nhiều giỏ hàng |
| User | writes | Review | 1:N | Mỗi user viết nhiều đánh giá |
| Category | contains | Product | 1:N | Mỗi category chứa nhiều sản phẩm |
| Category | has | Category (sub) | 1:N | Self-reference: danh mục cha-con |
| Product | belongs | Category | N:1 | Nhiều sản phẩm thuộc 1 category |
| Product | has | Review | 1:N | Mỗi sản phẩm có nhiều đánh giá |
| Product | appears in | CartItem | 1:N | Mỗi sản phẩm xuất hiện trong nhiều cart item |
| Product | appears in | OrderItem | 1:N | Mỗi sản phẩm xuất hiện trong nhiều order item |
| Cart | contains | CartItem | 1:N | Mỗi giỏ hàng chứa nhiều cart item |
| Order | contains | OrderItem | 1:N | Mỗi đơn hàng chứa nhiều order item |
| Order | has | Payment | 1:1 | Mỗi đơn hàng có 1 thanh toán |
| Table | has | Cart | 1:N | Mỗi bàn có nhiều giỏ hàng |
| Table | has | Order | 1:N | Mỗi bàn có nhiều đơn hàng |
| CartItem | references | Product | N:1 | Cart item tham chiếu đến product |
| OrderItem | references | Product | N:1 | Order item tham chiếu đến product |
| Order | references | User | N:1 | Nhiều đơn thuộc 1 user |
| Order | references | Table | N:1 | Nhiều đơn thuộc 1 table |
| Payment | references | Order | N:1 | Payment thuộc 1 order |

---

## 5. SƠ ĐỒ THỰC THỂ MỞ RỘNG (EER)

### 5.1 Mô hình phân quyền User - Admin

```
┌────────────────────────────────────────────────────────┐
│                    Phân quyền hệ thống                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│                    ┌──────────────┐                    │
│                    │    USER      │                    │
│                    │  (Khách hàng) │                    │
│                    ├──────────────┤                    │
│                    │ + xem sản phẩm│                    │
│                    │ + đặt hàng    │                    │
│                    │ + đánh giá   │                    │
│                    │ + quản lý tài│                    │
│                    │   khoản cá nhân│                  │
│                    └──────┬───────┘                    │
│                           │ inherits                     │
│                           ▼                             │
│                    ┌──────────────┐                    │
│                    │    ADMIN     │                    │
│                    │ (Quản trị viên)│                   │
│                    ├──────────────┤                    │
│                    │ + tất cả quyền│                  │
│                    │   của USER   │                    │
│                    │ + quản lý sp │                    │
│                    │ + quản lý đơn│                    │
│                    │ + quản lý user│                   │
│                    │ + xem thống kê│                   │
│                    │ + quản lý bàn│                    │
│                    │ + quản lý mã │                    │
│                    │   giảm giá   │                    │
│                    └──────────────┘                    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 5.2 Mô hình đặt hàng 2 luồng

```
┌────────────────────────────────────────────────────────────────┐
│                    Hai luồng đặt hàng                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────┐         ┌─────────────────┐              │
│  │ Đặt hàng ONLINE │         │ Đặt hàng QR     │              │
│  │   (userId)      │         │  (tableId)      │              │
│  ├─────────────────┤         ├─────────────────┤              │
│  │ - Cần đăng nhập │         │ - Không cần đăng│              │
│  │ - Có địa chỉ   │         │   nhập          │              │
│  │   giao hàng    │         │ - Địa chỉ giao  │              │
│  │ - Có phí ship  │         │   hàng = vị trí │              │
│  │ - Giao đến địa │         │   bàn           │              │
│  │   chỉ khách    │         │ - Không phí ship│              │
│  │ - Đơn mang về  │         │ - Nhận món tại  │              │
│  │   hoặc giao hàng│         │   bàn           │              │
│  └────────┬────────┘         └────────┬────────┘              │
│           │                           │                        │
│           └──────────┬────────────────┘                        │
│                      ▼                                        │
│             ┌────────────────┐                                │
│             │     ORDER      │                                │
│             │   (Thống nhất)  │                                │
│             ├────────────────┤                                │
│             │ userId OR      │                                │
│             │ tableId        │                                │
│             │ deliveryAddr   │                                │
│             │ deliveryFee    │                                │
│             └───────┬────────┘                                │
│                     │                                         │
│                     ▼                                         │
│             ┌────────────────┐                                │
│             │    PAYMENT     │                                │
│             │  COD | VNPay   │                                │
│             └────────────────┘                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 6. SƠ ĐỒ ERD THEO NOTATION

### 6.1 Ký hiệu Chen

```
                    1              N
┌──────────┐  ─────────────  ┌──────────────┐
│   USER   │─────────────────│    ORDER     │
└──────────┘                 └──────┬───────┘
                                    │ N
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼ N             ▼ 1             ▼ 1
              ┌──────────┐   ┌───────────┐   ┌──────────┐
              │  REVIEW  │   │  PAYMENT  │   │ORDERITEM │
              └──────────┘   └───────────┘   └────┬─────┘
                                                    │
              ┌──────────┐                          │ N
              │ ADDRESS  │◄── N:1 ─────────────────┘
              └──────────┘

┌──────────────┐  1      N ┌──────────────┐ 1      N ┌──────────────┐
│   CATEGORY   │───────────│   PRODUCT    │───────────│ ORDERITEM    │
└──────────────┘           └──────┬───────┘           └──────────────┘
                                  │
                                  │ 1:N
                                  ▼
                           ┌──────────────┐
                           │   REVIEW     │
                           └──────────────┘

┌──────────────┐  1      N ┌──────────────┐  N:1       ┌──────────────┐
│    TABLE     │───────────│     CART     │───────────│  CARTITEM    │
└──────────────┘           └──────┬───────┘           └──────┬───────┘
                                  │
                                  │ N:1
                                  ▼
                           ┌──────────────┐
                           │     USER     │
                           └──────────────┘

┌──────────────┐
│   COUPON     │  (Standalone - FK trong Cart)
└──────────────┘
```

---

## 7. CƠ SỞ DỮ LIỆU VẬT LÝ (PHYSICAL SCHEMA)

### 7.1 MongoDB Collections Schema

```javascript
// Collection: users
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String,
  name: String,
  phone: String,
  avatar: String,
  role: String (enum: 'user', 'admin'),
  isVerified: Boolean,
  address: String,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: email (unique), role, createdAt

// Collection: categories
{
  _id: ObjectId,
  name: String,
  slug: String (unique, indexed),
  description: String,
  image: String,
  parentId: ObjectId (nullable, indexed),
  isActive: Boolean,
  sortOrder: Number,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: slug (unique), parentId, isActive, sortOrder

// Collection: products
{
  _id: ObjectId,
  name: String,
  slug: String (unique, indexed),
  description: String,
  price: Number,
  originalPrice: Number,
  images: [String],
  video: String,
  categoryId: ObjectId (indexed),
  categoryName: String,
  rating: Number,
  reviewCount: Number,
  isAvailable: Boolean,
  isFeatured: Boolean,
  isNew: Boolean,
  preparationTime: Number,
  calories: Number,
  ingredients: [String],
  allergens: [String],
  tags: [String],
  stock: Number,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: slug (unique), categoryId, isFeatured, isAvailable, price, rating

// Collection: carts
{
  _id: ObjectId,
  userId: ObjectId (nullable, indexed),
  tableId: ObjectId (nullable, indexed),
  items: [{
    _id: ObjectId,
    productId: ObjectId,
    product: Object (embedded),
    quantity: Number,
    price: Number,
    notes: String
  }],
  subtotal: Number,
  tax: Number,
  discount: Number,
  total: Number,
  couponCode: String,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: userId, tableId, updatedAt

// Collection: orders
{
  _id: ObjectId,
  orderNumber: String (unique, indexed),
  userId: ObjectId (indexed),
  userName: String,
  userPhone: String,
  userEmail: String,
  deliveryAddress: String,
  tableId: ObjectId (nullable, indexed),
  tableName: String,
  items: [{
    productId: ObjectId,
    productName: String,
    productImage: String,
    price: Number,
    quantity: Number,
    notes: String,
    subtotal: Number
  }],
  subtotal: Number,
  tax: Number,
  discount: Number,
  deliveryFee: Number,
  total: Number,
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String,
  notes: String,
  estimatedDeliveryTime: String,
  cancelledAt: Date,
  cancelledReason: String,
  createdAt: Date (indexed),
  updatedAt: Date
}
// Indexes: orderNumber (unique), userId, tableId, orderStatus,
//          paymentStatus, createdAt

// Collection: payments
{
  _id: ObjectId,
  orderId: ObjectId (unique, indexed),
  amount: Number,
  method: String,
  status: String,
  transactionId: String,
  paymentUrl: String,
  voucherCode: String,
  createdAt: Date,
  paidAt: Date,
  refundedAt: Date
}
// Indexes: orderId (unique), status, createdAt

// Collection: reviews
{
  _id: ObjectId,
  productId: ObjectId (indexed),
  userId: ObjectId (indexed),
  userName: String,
  userAvatar: String,
  rating: Number,
  title: String,
  content: String,
  images: [String],
  isVerified: Boolean,
  helpful: Number,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: (productId, userId) unique compound, productId, userId, rating

// Collection: tables
{
  _id: ObjectId,
  number: String,
  qrCode: String (unique, indexed),
  capacity: Number,
  status: String,
  location: String,
  floor: Number,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: qrCode (unique), status, location

// Collection: addresses
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  name: String,
  phone: String,
  address: String,
  city: String,
  district: String,
  ward: String,
  label: String,
  isDefault: Boolean,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: userId, isDefault

// Collection: coupons
{
  _id: ObjectId,
  code: String (unique, indexed),
  name: String,
  type: String,
  value: Number,
  maxDiscount: Number,
  minOrderValue: Number,
  usageLimit: Number,
  usedCount: Number,
  startDate: Date,
  endDate: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: code (unique), isActive, endDate
```

---

## 8. CÁC TRIGGER/AUTOMATION CẦN THIẾT

### 8.1 Trigger: Cập nhật rating sản phẩm khi có đánh giá

```javascript
// Khi INSERT/UPDATE/DELETE trên bảng reviews:
1. Tính avg(rating) và COUNT(*) cho productId tương ứng
2. UPDATE products SET rating = avg, reviewCount = count WHERE _id = productId
```

### 8.2 Trigger: Quản lý tồn kho

```javascript
// Khi INSERT Order (sau khi thanh toán thành công):
1. Với mỗi item trong order.items:
   UPDATE products SET stock = stock - item.quantity WHERE _id = item.productId

// Khi UPDATE Order thành 'cancelled':
1. Với mỗi item trong order.items:
   UPDATE products SET stock = stock + item.quantity WHERE _id = item.productId
```

### 8.3 Trigger: Quản lý trạng thái bàn

```javascript
// Khi INSERT Order với tableId:
UPDATE tables SET status = 'occupied' WHERE _id = tableId

// Khi UPDATE Order thành 'completed' HOẶC 'cancelled':
UPDATE tables SET status = 'available' WHERE _id = tableId
```

### 8.4 Trigger: Địa chỉ mặc định

```javascript
// Khi UPDATE Address SET isDefault = true cho userId:
UPDATE addresses SET isDefault = false
WHERE userId = X AND _id != Y AND isDefault = true
```

### 8.5 Trigger: Đếm số lần sử dụng coupon

```javascript
// Khi Order có coupon được tạo thành công:
UPDATE coupons SET usedCount = usedCount + 1 WHERE code = couponCode

// Khi Order bị cancelled (có coupon):
UPDATE coupons SET usedCount = usedCount - 1 WHERE code = couponCode
```

---

## 9. BẢNG TỔNG HỢP CÁC RÀNG BUỘC (CONSTRAINTS)

### 9.1 Unique Constraints

| Bảng | Cột | Mô tả |
|------|-----|-------|
| users | email | Mỗi email chỉ đăng ký 1 tài khoản |
| products | slug | Mỗi sản phẩm có 1 slug URL duy nhất |
| categories | slug | Mỗi danh mục có 1 slug URL duy nhất |
| orders | orderNumber | Mỗi đơn hàng có 1 mã duy nhất |
| payments | orderId | Mỗi đơn hàng chỉ có 1 payment |
| reviews | (productId, userId) | Mỗi user chỉ đánh giá 1 lần/sản phẩm |
| tables | qrCode | Mỗi bàn có 1 QR code duy nhất |
| coupons | code | Mỗi coupon có 1 mã duy nhất |

### 9.2 Check Constraints

| Bảng | Cột | Điều kiện |
|------|-----|----------|
| products | price | >= 0 |
| products | rating | >= 0 AND <= 5 |
| products | reviewCount | >= 0 |
| products | stock | >= 0 |
| reviews | rating | >= 1 AND <= 5 |
| orders | total | > 0 |
| coupons | value | > 0 |
| coupons | usedCount | >= 0 |

### 9.3 Not Null Constraints

| Bảng | Cột |
|------|-----|
| users | email, password, name, phone |
| products | name, price, images |
| orders | orderNumber, userId, userName, userPhone, userEmail |
| order_items | productId, productName, price, quantity |
| payments | orderId, amount, method, status |
| addresses | userId, name, phone, address, city, district |

---

## 10. SƠ ĐỒ ERD TỔNG HỢP (KEYWORD)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                          HỆ THỐNG ĐẶT ĐỒ ĂN                                ║
║                        BÌNH BÚN BÒ - ERD TỔNG HỢP                          ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   ┌─────────────┐         ┌─────────────┐                                  ║
║   │   COUPON    │         │    USER     │                                  ║
║   └──────┬──────┘         └──────┬──────┘                                  ║
║          │ N:1 (FK in Cart)      │ 1:N                                      ║
║          │                       ├──┬──┬──┬──┐                             ║
║          │                  ┌─────┐ │  │  │  │ ┌─────┐                     ║
║          │              ┌───│ORDER│─┘  │  │  │ └──│CART │                     ║
║          │              │   └──┬──┘   │  │  │     └──┬──┘                     ║
║          │              │      │      │  │  │        │                        ║
║          │    ┌─────────┴──┐ ┌─┴───┐  │  │  │   ┌────┴────┐                  ║
║          │    │  ORDERITEM │ │PAYMENT│  │  │   │CARTITEM  │                  ║
║          │    └──────┬─────┘ └──────┘  │  │   └────┬─────┘                  ║
║          │           │                  │  │        │                        ║
║   ┌──────┴───┐  ┌────┴─────┐  ┌────────┴┐ │  │        │                        ║
║   │ CATEGORY ├─┤ PRODUCT  ├─┤  TABLE  │─┘  │  │        │                        ║
║   │          │ │          │ │         │────┘  │  │        │                        ║
║   └──────┬───┘ └──────┬────┘ └─────────┘       │  │        │                        ║
║          │           │                         │  │        │                        ║
║          │      ┌────┴─────┐                   │  │        │                        ║
║          │      │  REVIEW  │                   │  │        │                        ║
║          │      └──────────┘                   │  │        │                        ║
║          │                                      │  │        │                        ║
║          │         ┌──────────┐                 │  │        │                        ║
║          └─────────┤ ADDRESS  │◄────────────────┘  │        │                        ║
║                    └──────────┘                    │        │                        ║
║                                                   │        │                        ║
║   Ghi chú:                                         │        │                        ║
║   ────  Quan hệ 1:N (one-to-many)                  │        │                        ║
║   ════  Quan hệ N:1 (many-to-one)                  │        │                        ║
║   ───  Self-reference (Category cha-con)            │        │                        ║
║   [ ]  Embedded document (items)                    │        │                        ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## 11. MÔ TẢ QUY TRÌNH NGHIỆP VỤ THEO ERD

### 11.1 Quy trình đặt hàng online

```
1. User đăng nhập (users.email = ?)
       │
       ▼
2. User thêm sản phẩm vào giỏ (carts.userId = users._id)
       │
       ▼
3. User tạo đơn hàng (orders.userId = users._id)
       │
       ├── Tạo orderItems từ cartItems (snapshot thông tin sản phẩm)
       ├── Giảm stock của products
       └── Xóa cartItems
       │
       ▼
4. User chọn địa chỉ giao hàng (orders.deliveryAddress = addresses.address)
       │
       ▼
5. User chọn phương thức thanh toán
       │
       ├── COD: tạo payments (method='cod', status='pending')
       │        → Khi xác nhận đơn: status='paid'
       │
       └── VNPay: tạo payments (method='vnpay', status='pending')
                → Redirect VNPay
                → Callback: status='paid'
       │
       ▼
6. Admin cập nhật orderStatus: pending → confirmed → preparing → ready → delivering → delivered → completed
       │
       ▼
7. User đánh giá sản phẩm (reviews.productId = products._id, reviews.userId = users._id)
       │
       ▼
8. Trigger: cập nhật products.rating và products.reviewCount
```

### 11.2 Quy trình đặt hàng QR tại bàn

```
1. Khách quét QR trên bàn (tables.qrCode = ?)
       │
       ▼
2. Hệ thống tra cứu bàn (tables.status = 'available'/'occupied')
       │
       ▼
3. Khách thêm món vào giỏ (carts.tableId = tables._id)
       │
       ▼
4. Khách đặt hàng (orders.tableId = tables._id)
       │
       ├── Cập nhật tables.status = 'occupied'
       ├── Tạo orderItems từ cartItems
       └── Giảm stock
       │
       ▼
5. Thanh toán (COD hoặc VNPay)
       │
       ▼
6. Admin cập nhật trạng thái đơn hàng
       │
       ▼
7. Khi đơn hoàn thành/hủy: tables.status = 'available'
```

---

## 12. BẢNG SO SÁNH EMBEDDED vs REFERENCE

| Thực thể con | Kiểu | Lý do |
|-------------|------|-------|
| CartItem | Embedded | Số lượng items trong giỏ ít, cần đọc nhanh |
| OrderItem | Embedded | Snapshot để lưu trữ lịch sử độc lập với sản phẩm gốc |
| Product trong CartItem | Embedded (snapshot) | Giữ giá tại thời điểm thêm vào giỏ |
| Product trong OrderItem | Embedded (snapshot) | Lưu lịch sử giá, tên, ảnh tại thời điểm đặt |

**Tại sao không reference trong OrderItem?**
→ Vì khi sản phẩm bị sửa/xóa, thông tin đơn hàng cũ vẫn phải hiển thị đúng.
→ Denormalized snapshot là bắt buộc cho đơn hàng.
