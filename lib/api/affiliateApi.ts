import type { Product } from '@/types/product'
import { canopySearchProducts, getCanopyProductsByCategory, getApiUsage } from './canopy'

// Configuration
export const API_CONFIG = {
  amazon: {
    baseUrl: 'https://webservices.amazon.com/paapi5',
    accessKey: process.env.AMAZON_ACCESS_KEY,
    secretKey: process.env.AMAZON_SECRET_KEY,
    partnerTag: process.env.AMAZON_PARTNER_TAG,
  },
  walmart: {
    baseUrl: 'https://developer.api.walmart.com',
    apiKey: process.env.WALMART_API_KEY,
  },
  target: {
    baseUrl: 'https://api.target.com',
    apiKey: process.env.TARGET_API_KEY,
  }
}

interface GetProductsOptions {
  limit?: number
  offset?: number
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
}

// Live API integration with Canopy + fallback to test data
export async function getProductsFromAPI(options: GetProductsOptions = {}): Promise<Product[]> {
  try {
    const apiUsage = getApiUsage()
    console.log(`🔥 Canopy API Usage: ${apiUsage.used}/${apiUsage.limit} requests used`)
    
    // If we have API requests remaining, use live data
    if (apiUsage.remaining > 5) {
      let liveProducts: Product[] = []
      
      if (options.category) {
        // Get products by category from Canopy
        const canopyProducts = await getCanopyProductsByCategory(options.category)
        liveProducts = canopyProducts.map(convertCanopyToProduct)
      } else {
        // Get general trending products
        const canopyProducts = await canopySearchProducts('trending popular deals')
        liveProducts = canopyProducts.map(convertCanopyToProduct)
      }
      
      // Apply additional filters
      let filteredProducts = liveProducts
      
      if (options.minPrice) {
        filteredProducts = filteredProducts.filter(p => Number(p.price) >= options.minPrice!)
      }
      
      if (options.maxPrice) {
        filteredProducts = filteredProducts.filter(p => Number(p.price) <= options.maxPrice!)
      }
      
      // If we got results, return them
      if (filteredProducts.length > 0) {
        console.log(`✅ Returning ${filteredProducts.length} live products from Canopy`)
        return filteredProducts.slice(0, options.limit || 20)
      }
    } else {
      console.log('⚠️ Canopy API limit approaching, using test data')
    }
  } catch (error: unknown) {
    console.error('❌ Error fetching from Canopy API:', error instanceof Error ? error.message : String(error))
  }
  
  // Fallback to empty array since test data was removed
  console.log('📚 No test data available')
  return []
}

// Convert Canopy product to our Product type
function convertCanopyToProduct(canopyProduct: {
  id: string;
  title: string;
  price: string;
  mainImageUrl: string;
  affiliateUrl: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  description?: string;
  features?: string[];
  createdAt: string;
  updatedAt: string;
}): Product {
  // Parse price from display string (e.g., "$79.99" -> 79.99)
  const priceMatch = canopyProduct.price.match(/\$?([\d,]+\.?\d*)/)
  const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : 0
  
  return {
    id: canopyProduct.id,
    title: canopyProduct.title,
    price: price,
    imageUrl: canopyProduct.mainImageUrl,
    affiliateUrl: canopyProduct.affiliateUrl,
    source: 'amazon',
    category: canopyProduct.category || 'general',
    rating: canopyProduct.rating || 0,
    reviewCount: canopyProduct.reviewCount || 0,
    description: canopyProduct.description,
    features: canopyProduct.features || [],
    createdAt: canopyProduct.createdAt,
    updatedAt: canopyProduct.updatedAt,
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  // Mock implementation
  const products = await getProductsFromAPI()
  return products.find(p => p.id === productId) || null
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  return await getProductsFromAPI({ category: categoryId })
}

export async function getRelatedProducts(productId: string, category?: string): Promise<Product[]> {
  return await getProductsFromAPI({ 
    category, 
    limit: 4 
  })
}

export async function getDeals(options: GetProductsOptions = {}): Promise<Product[]> {
  const products = await getProductsFromAPI(options)
  return products.filter(p => p.discount && p.discount > 0)
}

export async function getFeaturedDeals(): Promise<Product[]> {
  const products = await getProductsFromAPI({ limit: 6 })
  return products.filter(p => p.discount && p.discount >= 20)
}

export async function searchProducts(query: string, options: GetProductsOptions = {}): Promise<Product[]> {
  const products = await getProductsFromAPI(options)
  return products.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.description?.toLowerCase().includes(query.toLowerCase())
  )
}

// Tracking functions
interface AffiliateClickData {
  productId: string
  source: string
  timestamp: string
  userId?: string
}

export async function trackAffiliateClick(data: AffiliateClickData): Promise<void> {
  try {
    // In a real app, you would send this to your analytics service
    console.log('Tracking affiliate click:', data)
    
    // Example: Send to your backend API
    // await fetch('/api/analytics/affiliate-click', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // })
  } catch (error: unknown) {
    console.error('Failed to track affiliate click:', error instanceof Error ? error.message : String(error))
  }
}
