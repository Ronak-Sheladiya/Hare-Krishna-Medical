-- Hare Krishna Medical Store - Supabase Database Setup
-- Run this script in your Supabase SQL Editor

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role INTEGER DEFAULT 0, -- 0: user, 1: admin
    address TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    category VARCHAR(100),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_address TEXT,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    shipping DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    order_id UUID REFERENCES orders(id),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_address TEXT,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    shipping DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    payment_status VARCHAR(50) DEFAULT 'pending',
    qr_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Letterheads table
CREATE TABLE IF NOT EXISTS letterheads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    letter_id VARCHAR(100) UNIQUE NOT NULL,
    letter_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    recipient JSONB,
    subject VARCHAR(255),
    content TEXT,
    header VARCHAR(255),
    footer TEXT,
    host JSONB,
    status VARCHAR(50) DEFAULT 'draft',
    language VARCHAR(20) DEFAULT 'english',
    created_by UUID REFERENCES users(id),
    qr_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Verifications table
CREATE TABLE IF NOT EXISTS verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    verification_id VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'invoice', 'letterhead'
    reference_id UUID NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_by VARCHAR(255),
    verification_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_letterheads_created_by ON letterheads(created_by);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE letterheads ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own data, admins can read all
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR 
    (SELECT role FROM users WHERE id::text = auth.uid()::text) = 1);

-- Products are readable by all, writable by admins
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify products" ON products
    FOR ALL USING ((SELECT role FROM users WHERE id::text = auth.uid()::text) = 1);

-- Orders are viewable by owner and admins
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (user_id::text = auth.uid()::text OR 
    (SELECT role FROM users WHERE id::text = auth.uid()::text) = 1);

-- Invoices are viewable by all for verification, modifiable by admins
CREATE POLICY "Invoices are viewable for verification" ON invoices
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify invoices" ON invoices
    FOR ALL USING ((SELECT role FROM users WHERE id::text = auth.uid()::text) = 1);

-- Messages are viewable by admins only
CREATE POLICY "Only admins can view messages" ON messages
    FOR ALL USING ((SELECT role FROM users WHERE id::text = auth.uid()::text) = 1);

-- Letterheads are viewable by all for verification, modifiable by admins
CREATE POLICY "Letterheads are viewable for verification" ON letterheads
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify letterheads" ON letterheads
    FOR ALL USING ((SELECT role FROM users WHERE id::text = auth.uid()::text) = 1);

-- Verifications are viewable by all
CREATE POLICY "Verifications are viewable by everyone" ON verifications
    FOR SELECT USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_letterheads_updated_at BEFORE UPDATE ON letterheads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user (password: Admin@123)
-- Note: You'll need to hash the password properly in your application
INSERT INTO users (full_name, email, password_hash, role, email_verified, is_active)
VALUES (
    'Admin User',
    'admin@harekrishnamedical.com',
    'temp_password_hash', -- Replace with proper bcrypt hash
    1,
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, stock, category, is_active) VALUES
('Paracetamol Tablets', '500mg - Pack of 10 tablets', 45.00, 100, 'Medicine', true),
('Vitamin D3 Capsules', '60,000 IU - Pack of 4 capsules', 299.00, 50, 'Supplements', true),
('Digital Thermometer', 'Accurate fever thermometer with LCD display', 450.00, 25, 'Equipment', true),
('Blood Pressure Monitor', 'Automatic digital BP monitor with memory', 1560.00, 15, 'Equipment', true),
('Hand Sanitizer', '500ml bottle - 70% alcohol content', 150.00, 200, 'Hygiene', true)
ON CONFLICT DO NOTHING;

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE letterheads;
ALTER PUBLICATION supabase_realtime ADD TABLE verifications;