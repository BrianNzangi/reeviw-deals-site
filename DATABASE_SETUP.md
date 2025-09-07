# Database Setup Instructions

## Quick Setup

The products table needs to be created in your Supabase database before you can fetch and store products.

### Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to the **SQL Editor** (left sidebar)

### Step 2: Create the Products Table

Copy and paste this SQL into the SQL Editor and click "Run":

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  affiliate_url TEXT UNIQUE,
  store VARCHAR(100),
  brand VARCHAR(100),
  category VARCHAR(50),
  rating DECIMAL(3,2),
  reviews_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_store ON public.products(store);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON public.products(rating);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_trending ON public.products(is_trending);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY IF NOT EXISTS "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

-- Create policy for insert (for the service role)
CREATE POLICY IF NOT EXISTS "Enable insert for service role" 
ON public.products FOR INSERT 
WITH CHECK (true);
```

### Step 3: Verify Table Creation

After running the SQL, you should see a success message. You can verify the table was created by:

1. Going to **Table Editor** in the left sidebar
2. You should see the `products` table listed

### Step 4: Fetch Products

Now you can run the product fetching script:

```bash
node scripts/fetchProductsSimple.cjs --categories electronics,home-garden,fashion,sports-outdoors,books-media,automotive --count 15 --featured
```

## Troubleshooting

### Error: "Could not find the table 'public.products'"
- Make sure you ran the SQL script in Step 2
- Check that the table appears in your Supabase Table Editor
- Verify your environment variables in `.env.local` are correct

### Error: "Row Level Security policy violation"
- Make sure you ran the policy creation SQL in Step 2
- Verify you're using the `SUPABASE_SERVICE_ROLE_KEY` (not the anon key)

### Error: API connection issues
- Check your `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
- Verify your `SUPABASE_SERVICE_ROLE_KEY` is the service role key (starts with `eyJ...`)

## Environment Variables Required

Make sure these are set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key
CANOPY_API_KEY=your-canopy-api-key
CANOPY_STORE_ID=your-store-id
```
