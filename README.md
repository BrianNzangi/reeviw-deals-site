# Bargainly - Find the Best Deals Online

Bargainly is a modern deal aggregation web application built with Next.js 14, featuring affiliate product integration, user authentication, and a clean, responsive design.

## Features

- 🛍️ Product aggregation from multiple affiliate networks (Amazon, Walmart, Target)
- 💾 **Supabase database integration** for product storage and user data
- ⚡ **Redis caching** for improved performance and reduced database load
- 👤 User authentication with Clerk (dormant)
- 📧 Newsletter subscription with Brevo
- 🎯 Curated product listings with favorites and click tracking
- 📱 Responsive design with Tailwind CSS
- ⚡ Fast performance with Next.js 14 App Router
- 🔍 Advanced filtering and search with analytics
- 📊 Analytics integration with search tracking

## Project Structure

```
bargainly/
├── app/
│   ├── (routes)/
│   │   ├── layout.tsx          # Root layout with Clerk Provider, MainNav, Footer
│   │   ├── page.tsx            # Homepage (infinite scroll ProductGrid left, VerticalAd right)
│   │   ├── categories/
│   │   ├── products/
│   │   ├── deals/
│   │   ├── listings/
│   │   ├── auth/
│   │   └── newsletter/
├── components/
│   ├── navbar/                 # Navigation components
│   ├── products/               # Product-related components
│   ├── ads/                    # Advertisement components
│   ├── ui/                     # Reusable UI components
│   └── affiliates/             # Affiliate link handling
├── lib/
│   ├── api/                    # API integrations
│   └── utils/                  # Utility functions
├── data/
│   └── test/                   # Test data
├── types/                      # TypeScript type definitions
└── styles/                     # Styling configurations
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account
- Clerk account
- Brevo account (for email)
- Affiliate API accounts (Amazon, Walmart, Target)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bargainly.git
   cd bargainly
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.template .env.local
   ```
   Fill in your API keys and configuration values in `.env.local`

4. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the database migrations (SQL files will be provided)
   - Update your Supabase keys in `.env.local`

5. **Set up Clerk Authentication**
   - Create account at [clerk.dev](https://clerk.dev)
   - Configure authentication settings
   - Update Clerk keys in `.env.local`

6. **Configure Affiliate APIs**
   - Amazon: Apply for Amazon Associates and Product Advertising API
   - Walmart: Apply for Walmart Open API
   - Target: Apply for Target Partners API

7. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.local.template` for all required environment variables including:

- Supabase configuration
- Clerk authentication keys  
- Brevo email service API key
- Affiliate API credentials (Amazon, Walmart, Target)
- Optional analytics keys (GTM, GA, Hotjar, Mixpanel)

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL) ✓ **INTEGRATED**
- **Caching:** Redis (Upstash) ✓ **INTEGRATED**
- **Authentication:** Clerk (dormant)
- **Email:** Brevo (formerly SendinBlue)
- **TypeScript:** Full type safety
- **Deployment:** Vercel (recommended)

## Key Components

- **ProductGrid**: Infinite scroll grid with product cards
- **VerticalAd**: Advertisement sidebar component
- **MainNav**: Header navigation with search
- **CategoryFilter**: Advanced filtering interface
- **AffiliateLink**: Click tracking for affiliate links
- **NewsletterForm**: Email subscription with Brevo

## API Integration

The app integrates with multiple affiliate APIs:

- **Amazon Product Advertising API**: For Amazon products
- **Walmart Open API**: For Walmart products  
- **Target Partners API**: For Target products

All API calls are handled in `lib/api/affiliateApi.ts` with proper error handling and rate limiting.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Current Progress ✅

### Recently Completed
- **Supabase Integration**: Full database setup with PostgreSQL backend
  - Products table with advanced filtering and search
  - User favorites system
  - Newsletter subscribers management
  - Click tracking for affiliate links
  - Search analytics
  - Row Level Security (RLS) policies

- **Redis Caching**: Performance optimization with Upstash Redis
  - Product caching with automatic invalidation
  - Search result caching
  - Configurable TTL settings
  - Smart cache key generation
  - Fallback patterns for cache failures

- **API Routes**: RESTful endpoints with caching
  - `/api/products` - Product CRUD operations with filtering
  - Search analytics tracking
  - Error handling and validation

### Database Schema
The Supabase database includes the following tables:
- `products` - Main product catalog
- `user_favorites` - User wishlist functionality
- `newsletter_subscribers` - Email subscription management
- `click_tracking` - Affiliate link analytics
- `search_analytics` - Search behavior tracking

### Next Steps
- [ ] User interface components for product display
- [ ] Search and filtering UI
- [ ] User favorites functionality
- [ ] Newsletter subscription form
- [ ] Affiliate link click tracking
- [ ] Admin dashboard for product management

## Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Note your project URL and anon key

2. **Run Database Migration**
   ```sql
   -- Execute the schema in your Supabase SQL editor
   -- File: supabase/schema.sql
   ```

3. **Configure Environment**
   ```bash
   cp .env.local.template .env.local
   # Update with your Supabase and Redis credentials
   ```

## Support

If you have any questions or need help, please open an issue or contact us at support@bargainly.com.
