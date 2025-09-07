// Environment variables and configuration constants

// Supabase Configuration
export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dbfximvzbumnplqhsydg.supabase.co',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiZnhpbXZ6YnVtbnBscWhzeWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjAzMDgsImV4cCI6MjA3MjczNjMwOH0.GZBZlWG6Sp0cSP9-cjf6YcHfqtGwFegdX5ZcTOPhicQ',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
} as const

// Redis Configuration
export const REDIS_CONFIG = {
  url: process.env.REDIS_URL || 'redis://default:AT0hAAIncDFhYzY0YmQ1ZmM5OGI0Y2JlYTAyNWY2NDIyMzE3OTYzZXAxMTU2NDk@funky-boa-15649.upstash.io:6379',
  tls: true,
  maxRetries: 3,
  retryDelay: 1000,
  defaultTTL: 60 * 60, // 1 hour
  cacheKeys: {
    products: 'products:',
    categories: 'categories:',
    search: 'search:',
    affiliate: 'affiliate:',
  },
} as const

// Clerk Configuration (Dormant)
// export const CLERK_CONFIG = {
//   publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
//   secretKey: process.env.CLERK_SECRET_KEY,
//   signInUrl: '/auth/sign-in',
//   signUpUrl: '/auth/sign-up',
//   afterSignInUrl: '/',
//   afterSignUpUrl: '/onboarding',
// } as const

// Brevo Configuration
export const BREVO_CONFIG = {
  apiKey: process.env.BREVO_API_KEY!,
  baseUrl: 'https://api.brevo.com/v3',
  newsletterListId: 1, // Configure this in your Brevo dashboard
  fromEmail: process.env.FROM_EMAIL || 'noreply@reeviw.com',
  fromName: 'Reeviw',
} as const

// Affiliate API Configuration
export const AFFILIATE_CONFIG = {
  amazon: {
    accessKey: process.env.AMAZON_ACCESS_KEY,
    secretKey: process.env.AMAZON_SECRET_KEY,
    partnerTag: process.env.AMAZON_PARTNER_TAG,
    region: 'us-east-1',
    baseUrl: 'https://webservices.amazon.com/paapi5',
  },
  walmart: {
    apiKey: process.env.WALMART_API_KEY,
    baseUrl: 'https://developer.api.walmart.com',
  },
  target: {
    apiKey: process.env.TARGET_API_KEY,
    baseUrl: 'https://api.target.com',
  },
} as const

// Application Configuration
export const APP_CONFIG = {
  name: 'Reeviw',
  description: 'Find the Best Deals, Coupons, and Discounts Online',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://reeviw.com',
  logo: '/reeviw-logo.png',
  favicon: '/favicon.ico',
  defaultImage: '/images/default-product.jpg',
} as const

// Pagination Configuration
export const PAGINATION_CONFIG = {
  productsPerPage: 20,
  productsPerPageMobile: 12,
  maxPages: 100,
  prefetchPages: 2,
} as const

// Categories Configuration
export const CATEGORIES = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets and tech deals',
    icon: '📱',
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    description: 'Everything for your home',
    icon: '🏠',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Clothing and accessories',
    icon: '👕',
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    description: 'Personal care products',
    icon: '💄',
  },
  {
    id: 'sports-outdoors',
    name: 'Sports & Outdoors',
    description: 'Fitness and outdoor gear',
    icon: '⚽',
  },
  {
    id: 'books-media',
    name: 'Books & Media',
    description: 'Books, movies, and music',
    icon: '📚',
  },
  {
    id: 'toys-games',
    name: 'Toys & Games',
    description: 'Fun for all ages',
    icon: '🎮',
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Car parts and accessories',
    icon: '🚗',
  },
] as const

// Price Ranges for Filters
export const PRICE_RANGES = [
  { min: 0, max: 25, label: 'Under $25' },
  { min: 25, max: 50, label: '$25 - $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 200, label: '$100 - $200' },
  { min: 200, max: 500, label: '$200 - $500' },
  { min: 500, max: null, label: 'Over $500' },
] as const

// Discount Thresholds
export const DISCOUNT_THRESHOLDS = [
  { min: 10, label: '10%+ Off' },
  { min: 25, label: '25%+ Off' },
  { min: 50, label: '50%+ Off' },
  { min: 70, label: '70%+ Off' },
] as const

// Sort Options
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'discount', label: 'Highest Discount' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Best Rating' },
] as const

// Listing Types for Curated Listings
export const LISTING_TYPES = [
  { value: 'featured', label: 'Featured Deals' },
  { value: 'trending', label: 'Trending Now' },
  { value: 'editors-choice', label: "Editor's Choice" },
  { value: 'limited-time', label: 'Limited Time' },
  { value: 'flash-sale', label: 'Flash Sale' },
] as const

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID,
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
  mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
} as const

// Error Messages
export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  notFound: 'The requested item was not found.',
  unauthorized: 'You need to sign in to access this feature.',
  emailRequired: 'Please enter a valid email address.',
  subscriptionFailed: 'Failed to subscribe. Please try again.',
  loadingFailed: 'Failed to load content. Please refresh the page.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  subscribed: 'Successfully subscribed to newsletter!',
  favoriteAdded: 'Added to your favorites!',
  favoriteRemoved: 'Removed from favorites.',
  profileUpdated: 'Profile updated successfully!',
} as const

// Time Constants
export const TIME_CONSTANTS = {
  debounceDelay: 300,
  cacheTimeout: 1000 * 60 * 5, // 5 minutes
  refreshInterval: 1000 * 60 * 30, // 30 minutes
  sessionTimeout: 1000 * 60 * 60 * 24 * 7, // 1 week
} as const
