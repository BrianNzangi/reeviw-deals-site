export type Product = {
  id: string
  title: string
  description?: string | null
  price: number | string
  originalPrice?: string
  discount?: number
  image_url?: string | null
  imageUrl?: string | null
  mainImageUrl?: string | null
  affiliate_url?: string
  affiliateUrl?: string
  link?: string
  url?: string
  store?: string
  vendor?: string
  brand?: string
  source?: string
  category?: string
  rating?: number | null
  reviews_count?: number
  reviewCount?: number
  features?: string[]
  featureBullets?: string[]
  is_featured?: boolean
  is_trending?: boolean
  isPrime?: boolean
  created_at?: string
  updated_at?: string
  createdAt?: string
  updatedAt?: string
}
