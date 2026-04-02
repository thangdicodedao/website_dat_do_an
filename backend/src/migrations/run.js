require('dotenv').config();
const mysql = require('mysql2/promise');

const SQL = `
-- ============================================
-- Database: binh_bun_bo
-- Run this script to create all tables
-- ============================================

CREATE DATABASE IF NOT EXISTS binh_bun_bo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE binh_bun_bo;

-- ============================================
-- Table: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  phone         VARCHAR(20) NOT NULL,
  avatar        VARCHAR(500) DEFAULT NULL,
  role          ENUM('user', 'admin') DEFAULT 'user',
  is_verified   TINYINT(1) DEFAULT 0,

  -- Address (simple field)
  address       VARCHAR(500) DEFAULT NULL,

  -- Email verification
  verification_code          VARCHAR(10) DEFAULT NULL,
  verification_code_expires  DATETIME DEFAULT NULL,

  -- Password reset
  reset_password_code        VARCHAR(10) DEFAULT NULL,
  reset_password_expires     DATETIME DEFAULT NULL,

  -- Refresh token (stored for revocation)
  refresh_token   VARCHAR(500) DEFAULT NULL,

  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at),
  INDEX idx_role_created (role, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: addresses
-- ============================================
CREATE TABLE IF NOT EXISTS addresses (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED NOT NULL,
  name          VARCHAR(100) NOT NULL,
  phone         VARCHAR(20) NOT NULL,
  address       VARCHAR(500) NOT NULL,
  city          VARCHAR(100) DEFAULT 'TP.HCM',
  district      VARCHAR(100) DEFAULT '',
  ward          VARCHAR(100) DEFAULT '',
  label         VARCHAR(50) DEFAULT 'Nhà riêng',
  is_default    TINYINT(1) DEFAULT 0,

  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: products (for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) NOT NULL UNIQUE,
  description     TEXT,
  price           DECIMAL(10,0) NOT NULL,
  original_price  DECIMAL(10,0) DEFAULT NULL,
  images          JSON,
  category_id     INT UNSIGNED DEFAULT NULL,
  rating          DECIMAL(2,1) DEFAULT 0,
  review_count    INT DEFAULT 0,
  stock           INT DEFAULT 0,
  is_available    TINYINT(1) DEFAULT 1,
  is_featured     TINYINT(1) DEFAULT 0,
  is_new          TINYINT(1) DEFAULT 0,
  tags            JSON,
  ingredients     TEXT,
  allergens       TEXT,

  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (category_id) REFERENCES products(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_category (category_id),
  INDEX idx_featured (is_featured),
  INDEX idx_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: categories (for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  slug          VARCHAR(255) NOT NULL UNIQUE,
  description   TEXT,
  image         VARCHAR(500) DEFAULT NULL,
  parent_id     INT UNSIGNED DEFAULT NULL,
  is_active     TINYINT(1) DEFAULT 1,
  sort_order    INT DEFAULT 0,

  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: orders (for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number    VARCHAR(50) NOT NULL UNIQUE,
  user_id         INT UNSIGNED DEFAULT NULL,
  items           JSON,
  subtotal        DECIMAL(10,0) DEFAULT 0,
  tax             DECIMAL(10,0) DEFAULT 0,
  discount        DECIMAL(10,0) DEFAULT 0,
  delivery_fee    DECIMAL(10,0) DEFAULT 0,
  total           DECIMAL(10,0) DEFAULT 0,
  payment_method  ENUM('cod', 'vnpay') DEFAULT 'cod',
  payment_status  ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  order_status    ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  notes           TEXT,
  shipping_address VARCHAR(500) DEFAULT NULL,

  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_order_number (order_number),
  INDEX idx_order_status (order_status),
  INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: payments (for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id        INT UNSIGNED NOT NULL,
  amount          DECIMAL(10,0) NOT NULL,
  method          VARCHAR(50) DEFAULT 'cod',
  status          ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  transaction_id  VARCHAR(255) DEFAULT NULL,
  payment_url     VARCHAR(500) DEFAULT NULL,
  paid_at         DATETIME DEFAULT NULL,

  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order (order_id),
  INDEX idx_transaction (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: reviews (for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id    INT UNSIGNED NOT NULL,
  user_id       INT UNSIGNED DEFAULT NULL,
  rating        TINYINT(1) NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title         VARCHAR(255) DEFAULT NULL,
  content       TEXT,
  images        JSON,
  is_verified   TINYINT(1) DEFAULT 0,
  helpful       INT DEFAULT 0,

  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_product (product_id),
  INDEX idx_user (user_id),
  INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: tables (for future use - QR order)
-- ============================================
CREATE TABLE IF NOT EXISTS tables (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  number      VARCHAR(20) NOT NULL UNIQUE,
  qr_code     VARCHAR(100) NOT NULL UNIQUE,
  capacity    INT DEFAULT 4,
  status      ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
  location    VARCHAR(100) DEFAULT NULL,
  floor       INT DEFAULT 1,

  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_qr (qr_code),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: coupons (for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS coupons (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(50) NOT NULL UNIQUE,
  type            ENUM('percent', 'fixed') DEFAULT 'percent',
  value           DECIMAL(10,0) NOT NULL,
  max_discount    DECIMAL(10,0) DEFAULT NULL,
  min_order_value DECIMAL(10,0) DEFAULT 0,
  usage_limit     INT DEFAULT NULL,
  used_count      INT DEFAULT 0,
  start_date      DATETIME NOT NULL,
  end_date        DATETIME NOT NULL,
  is_active       TINYINT(1) DEFAULT 1,

  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_code (code),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: carts (for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS carts (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED DEFAULT NULL,
  table_id      INT UNSIGNED DEFAULT NULL,
  items         JSON,
  subtotal      DECIMAL(10,0) DEFAULT 0,
  tax           DECIMAL(10,0) DEFAULT 0,
  discount      DECIMAL(10,0) DEFAULT 0,
  total         DECIMAL(10,0) DEFAULT 0,

  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_table (table_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

async function run() {
  // Connect without database first
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    console.log('Running migrations...');
    await connection.query(SQL);
    console.log('✅ All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

run();
