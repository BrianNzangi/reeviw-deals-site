-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    discount_percentage INTEGER,
    image_url TEXT,
    affiliate_url TEXT NOT NULL,
    store TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT,
    rating DECIMAL(2, 1),
    reviews_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Clerk user ID
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create click_tracking table for affiliate links
CREATE TABLE IF NOT EXISTS click_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id TEXT, -- Optional, for authenticated users
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create search_analytics table
CREATE TABLE IF NOT EXISTS search_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    query TEXT NOT NULL,
    results_count INTEGER DEFAULT 0,
    user_id TEXT, -- Optional, for authenticated users
    ip_address INET,
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_store ON products(store);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_discount ON products(discount_percentage);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_trending ON products(is_trending);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_product_id ON user_favorites(product_id);

CREATE INDEX IF NOT EXISTS idx_click_tracking_product_id ON click_tracking(product_id);
CREATE INDEX IF NOT EXISTS idx_click_tracking_clicked_at ON click_tracking(clicked_at);

CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics(query);
CREATE INDEX IF NOT EXISTS idx_search_analytics_searched_at ON search_analytics(searched_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for products table
CREATE OR REPLACE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Products: Public read access, admin write access
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Products are insertable by service role" ON products
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Products are updatable by service role" ON products
    FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Products are deletable by service role" ON products
    FOR DELETE USING (auth.role() = 'service_role');

-- User favorites: Users can only access their own favorites
CREATE POLICY "Users can view own favorites" ON user_favorites
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own favorites" ON user_favorites
    FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own favorites" ON user_favorites
    FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- Newsletter subscribers: Public insert, admin read/update
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Newsletter subscribers viewable by service role" ON newsletter_subscribers
    FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Newsletter subscribers updatable by service role" ON newsletter_subscribers
    FOR UPDATE USING (auth.role() = 'service_role');

-- Click tracking: Public insert, admin read
CREATE POLICY "Anyone can insert click tracking" ON click_tracking
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Click tracking viewable by service role" ON click_tracking
    FOR SELECT USING (auth.role() = 'service_role');

-- Search analytics: Public insert, admin read
CREATE POLICY "Anyone can insert search analytics" ON search_analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Search analytics viewable by service role" ON search_analytics
    FOR SELECT USING (auth.role() = 'service_role');

-- Create some sample data (optional, for testing)
-- INSERT INTO products (title, description, price, original_price, discount_percentage, image_url, affiliate_url, store, category, brand, rating, reviews_count, is_featured, is_trending)
-- VALUES 
--     ('Apple iPhone 15 Pro', 'Latest iPhone with titanium design', 999.99, 1199.99, 17, 'https://example.com/iphone15pro.jpg', 'https://affiliate.link/iphone15pro', 'Apple', 'electronics', 'Apple', 4.8, 1250, true, true),
--     ('Samsung 65" 4K Smart TV', '4K UHD Smart TV with HDR', 599.99, 899.99, 33, 'https://example.com/samsung-tv.jpg', 'https://affiliate.link/samsung-tv', 'Best Buy', 'electronics', 'Samsung', 4.5, 850, true, false),
--     ('Nike Air Max 270', 'Comfortable running shoes', 129.99, 159.99, 19, 'https://example.com/nike-airmax.jpg', 'https://affiliate.link/nike-airmax', 'Nike', 'fashion', 'Nike', 4.6, 2100, false, true);
