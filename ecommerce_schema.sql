-- PostgreSQL Ecommerce Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ROLES
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);

-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES roles(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- BRANDS
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    logo TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- PRODUCT ENUMS
CREATE TYPE product_status AS ENUM ('active', 'inactive');

-- PRODUCTS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id),
    brand_id UUID REFERENCES brands(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    price NUMERIC(12,2) NOT NULL,
    discount NUMERIC(12,2),
    stock INT,
    status product_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PRODUCT IMAGES
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE
);

-- SIZES
CREATE TABLE sizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    size_label VARCHAR(50) NOT NULL
);

-- PRODUCT VARIANTS
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) NOT NULL,
    color VARCHAR(100),
    size_id UUID REFERENCES sizes(id),
    stock INT DEFAULT 0
);

-- CARTS
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- CART ITEMS
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES carts(id),
    product_variant_id UUID REFERENCES product_variants(id),
    quantity INT DEFAULT 1
);

-- ORDER ENUMS
CREATE TYPE payment_method AS ENUM ('cod', 'momo', 'zalopay', 'paypal');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed');
CREATE TYPE shipping_method AS ENUM ('standard', 'express', 'pickup');
CREATE TYPE shipping_status AS ENUM ('pending','processing','shipping','delivered','cancelled','returned');

-- ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    total_amount NUMERIC(12,2) NOT NULL,
    payment_method payment_method,
    payment_status payment_status,
    shipping_method shipping_method,
    shipping_fee NUMERIC(12,2),
    shipping_status shipping_status,
    tracking_code VARCHAR(255),
    shipping_address TEXT NOT NULL,
    receiver_name VARCHAR(255),
    receiver_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ORDER ITEMS
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    product_variant_id UUID REFERENCES product_variants(id),
    quantity INT DEFAULT 1,
    price NUMERIC(12,2) NOT NULL
);

-- SHIPPING LOGS
CREATE TYPE shipping_log_status AS ENUM ('processing','pickup','shipping','delivered','failed','returned');

CREATE TABLE shipping_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    status shipping_log_status,
    note TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PAYMENTS
CREATE TYPE payment_state AS ENUM ('pending','success','failed');

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    amount NUMERIC(12,2) NOT NULL,
    method payment_method,
    status payment_state,
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- REVIEWS
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    user_id UUID REFERENCES users(id),
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- COUPONS
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(255) UNIQUE NOT NULL,
    discount_percent INT,
    min_order NUMERIC(12,2),
    expired_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- BANNERS
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    image_url TEXT NOT NULL,
    link TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
