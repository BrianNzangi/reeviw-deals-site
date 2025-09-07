import type { Product } from './product'

export interface Listing {
  id: string
  productId: string
  title: string
  description?: string
  type: 'featured' | 'trending' | 'editors-choice' | 'limited-time' | 'flash-sale'
  isActive: boolean
  isFeatured: boolean
  featuredOrder?: number
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
  product?: Product
}

export interface ListingWithProduct extends Listing {
  product: Product
}

// Listing filter options
export interface ListingFilter {
  type?: Listing['type']
  isActive?: boolean
  isFeatured?: boolean
  categoryId?: string
  source?: string
  minDiscount?: number
  maxPrice?: number
  sortBy?: 'featured' | 'newest' | 'endDate' | 'discount'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

// Listing statistics
export interface ListingStats {
  total: number
  active: number
  featured: number
  expired: number
  upcoming: number
  byType: {
    [K in Listing['type']]: number
  }
}
