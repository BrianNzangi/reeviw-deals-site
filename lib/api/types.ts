// API Response Types

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Affiliate API Types
export interface AmazonProductResponse {
  ItemsResult: {
    Items: AmazonProduct[]
  }
}

export interface AmazonProduct {
  ASIN: string
  DetailPageURL: string
  Images: {
    Primary: {
      Large: {
        URL: string
        Height: number
        Width: number
      }
    }
  }
  ItemInfo: {
    Title: {
      DisplayValue: string
    }
    Features?: {
      DisplayValues: string[]
    }
  }
  Offers: {
    Listings: Array<{
      Price: {
        Amount: number
        Currency: string
        DisplayAmount: string
      }
      SavingsAmount?: {
        Amount: number
        DisplayAmount: string
      }
    }>
  }
}

export interface WalmartProductResponse {
  items: WalmartProduct[]
  totalResults: number
  start: number
  numItems: number
}

export interface WalmartProduct {
  itemId: number
  name: string
  salePrice: number
  msrp?: number
  thumbnailImage: string
  largeImage: string
  productUrl: string
  categoryPath: string
  shortDescription?: string
  longDescription?: string
  customerRating: string
  numReviews: number
}

// Supabase Database Types
export interface DatabaseProduct {
  id: string
  title: string
  description?: string
  price: number
  original_price?: number
  discount?: number
  image_url: string
  affiliate_url: string
  source: string
  category: string
  rating?: number
  review_count?: number
  features?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DatabaseCategory {
  id: string
  name: string
  description?: string
  icon?: string
  parent_id?: string
  is_active: boolean
  sort_order: number
  product_count?: number
  created_at: string
  updated_at: string
}

export interface DatabaseListing {
  id: string
  product_id: string
  title: string
  description?: string
  type: 'featured' | 'trending' | 'editors-choice' | 'limited-time' | 'flash-sale'
  is_active: boolean
  is_featured: boolean
  featured_order?: number
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
  product?: DatabaseProduct
}

export interface UserProfile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  preferences?: {
    categories: string[]
    priceRange: {
      min: number
      max: number
    }
    emailNotifications: boolean
  }
  created_at: string
  updated_at: string
}

// Brevo API Types
export interface BrevoContact {
  email: string
  id: number
  emailBlacklisted: boolean
  smsBlacklisted: boolean
  createdAt: string
  modifiedAt: string
  attributes: Record<string, unknown>
  listIds: number[]
}

export interface BrevoEmailResponse {
  messageId: string
}

export interface BrevoListResponse {
  lists: Array<{
    id: number
    name: string
    totalBlacklisted: number
    totalSubscribers: number
    uniqueSubscribers: number
    folderId: number
    createdAt: string
    campaignStats: Record<string, number>
  }>
}

// Analytics Types
export interface AnalyticsEvent {
  event: string
  properties: Record<string, unknown>
  userId?: string
  sessionId?: string
  timestamp: string
}

export interface ProductViewEvent extends AnalyticsEvent {
  event: 'product_view'
  properties: {
    productId: string
    productTitle: string
    productPrice: number
    productCategory: string
    source: string
  }
}

export interface AffiliateClickEvent extends AnalyticsEvent {
  event: 'affiliate_click'
  properties: {
    productId: string
    affiliateUrl: string
    source: string
    price: number
  }
}

export interface SearchEvent extends Omit<AnalyticsEvent, 'properties'> {
  event: 'search'
  properties: {
    query: string
    resultsCount: number
    filters?: Record<string, unknown>
  }
}
