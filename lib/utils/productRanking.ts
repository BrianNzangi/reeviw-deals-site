import { Product } from '@/types/product'

// KPI weights for ranking algorithm
export const RANKING_WEIGHTS = {
  BEST_SELLERS: 0.40,      // 40% - is_trending/is_featured flags
  HIGH_RATING: 0.30,       // 30% - Product rating (1-5 stars)
  REVIEW_COUNT: 0.20,      // 20% - Number of reviews
  PRICE_VALUE: 0.10,       // 10% - Price value and competitiveness
} as const

// Price and category preferences
export const PRODUCT_PREFERENCES = {
  MIN_PRICE: 12,           // Minimum price threshold for quality
  HIGH_VALUE_THRESHOLD: 50, // High value product threshold
  ELECTRONICS_BOOST: 0.15,  // Additional score boost for electronics
  LOW_PRICE_PENALTY: 0.5,   // Penalty multiplier for products below minimum
} as const

export interface ProductScore {
  product: Product
  score: number
  breakdown: {
    bestSellerScore: number
    ratingScore: number
    reviewScore: number
    priceScore: number
    categoryBoost: number
  }
}

/**
 * Calculate best seller score (40% weight)
 * Based on is_trending and is_featured flags
 */
function calculateBestSellerScore(product: Product): number {
  let score = 0
  
  // Featured products get higher boost
  if (product.is_featured) score += 1.0
  
  // Trending products get moderate boost
  if (product.is_trending) score += 0.7
  
  // Cap at 1.0
  return Math.min(score, 1.0)
}

/**
 * Calculate rating score (30% weight)
 * Normalize rating from 1-5 scale to 0-1 scale
 */
function calculateRatingScore(product: Product): number {
  const rating = product.rating || 0
  
  if (rating <= 0) return 0
  
  // Convert 1-5 star rating to 0-1 scale
  // 5 stars = 1.0, 4 stars = 0.75, etc.
  return (rating - 1) / 4
}

/**
 * Calculate review count score (20% weight)
 * Use logarithmic scaling to prevent outliers from dominating
 */
function calculateReviewScore(product: Product, maxReviews: number): number {
  const reviewCount = product.reviews_count || 0
  
  if (reviewCount <= 0 || maxReviews <= 0) return 0
  
  // Use log scale to normalize - products with more reviews get higher scores
  // but with diminishing returns
  const logScore = Math.log(reviewCount + 1) / Math.log(maxReviews + 1)
  
  return Math.min(logScore, 1.0)
}

/**
 * Calculate price value score (10% weight)
 * Considers price thresholds, high-value preference, and competitiveness
 */
function calculatePriceValueScore(product: Product, maxPrice: number, minPrice: number): number {
  const price = Number(product.price) || 0

  if (price <= 0 || maxPrice <= minPrice) return 0
  
  let score = 0
  
  // Base competitiveness score (inverse relationship for competitive pricing)
  const priceRange = maxPrice - minPrice
  const normalizedPrice = (price - minPrice) / priceRange
  const competitivenessScore = Math.max(0, 1 - normalizedPrice)
  
  // Quality threshold scoring
  if (price < PRODUCT_PREFERENCES.MIN_PRICE) {
    // Below minimum threshold - penalize heavily
    score = competitivenessScore * PRODUCT_PREFERENCES.LOW_PRICE_PENALTY
  } else if (price >= PRODUCT_PREFERENCES.HIGH_VALUE_THRESHOLD) {
    // High value products - boost score
    score = Math.min(1.0, competitivenessScore + 0.3)
  } else {
    // In acceptable range - standard scoring
    score = competitivenessScore
  }
  
  return Math.min(1.0, Math.max(0, score))
}

/**
 * Calculate category boost for electronics
 * Electronics products get additional scoring boost
 */
function calculateCategoryBoost(product: Product): number {
  const category = product.category?.toLowerCase() || ''
  
  // Check if product is in electronics category
  if (category.includes('electronic') || 
      category.includes('tech') ||
      category.includes('computer') ||
      category.includes('phone') ||
      category.includes('laptop') ||
      category.includes('tablet') ||
      category.includes('gaming') ||
      category.includes('audio') ||
      category.includes('camera')) {
    return PRODUCT_PREFERENCES.ELECTRONICS_BOOST
  }
  
  return 0
}

/**
 * Calculate overall product score using KPI weights
 */
function calculateProductScore(
  product: Product,
  maxReviews: number,
  maxPrice: number,
  minPrice: number
): ProductScore {
  const bestSellerScore = calculateBestSellerScore(product)
  const ratingScore = calculateRatingScore(product)
  const reviewScore = calculateReviewScore(product, maxReviews)
  const priceValueScore = calculatePriceValueScore(product, maxPrice, minPrice)
  const categoryBoost = calculateCategoryBoost(product)
  
  // Calculate weighted total score
  const baseScore = 
    bestSellerScore * RANKING_WEIGHTS.BEST_SELLERS +
    ratingScore * RANKING_WEIGHTS.HIGH_RATING +
    reviewScore * RANKING_WEIGHTS.REVIEW_COUNT +
    priceValueScore * RANKING_WEIGHTS.PRICE_VALUE
  
  // Apply category boost (additive)
  const totalScore = Math.min(1.0, baseScore + categoryBoost)
  
  return {
    product,
    score: totalScore,
    breakdown: {
      bestSellerScore,
      ratingScore,
      reviewScore,
      priceScore: priceValueScore,
      categoryBoost,
    }
  }
}

/**
 * Rank products based on KPI scoring system
 * Returns products sorted by score (highest first)
 */
export function rankProducts(products: Product[]): ProductScore[] {
  if (!products || products.length === 0) return []
  
  // Calculate min/max values for normalization
  const prices = products.map(p => Number(p.price) || 0).filter(p => p > 0)
  const reviewCounts = products.map(p => p.reviews_count || 0)

  const maxPrice = Math.max(...prices, 1)
  const minPrice = Math.min(...prices, 0)
  const maxReviews = Math.max(...reviewCounts, 1)
  
  // Calculate scores for all products
  const scoredProducts = products.map(product => 
    calculateProductScore(product, maxReviews, maxPrice, minPrice)
  )
  
  // Sort by score (highest first)
  return scoredProducts.sort((a, b) => b.score - a.score)
}

/**
 * Get top N products based on ranking
 */
export function getTopRankedProducts(products: Product[], limit: number = 200): Product[] {
  const rankedProducts = rankProducts(products)
  return rankedProducts.slice(0, limit).map(item => item.product)
}

/**
 * Debug function to show ranking breakdown
 */
export function debugProductRanking(products: Product[], topN: number = 10): void {
  const rankedProducts = rankProducts(products).slice(0, topN)
  
  console.log('🏆 Top Ranked Products (KPI-based with Preferences):')
  console.log('Weights: Best Sellers 40% | Rating 30% | Reviews 20% | Price Value 10% + Electronics Boost 15%')
  console.log('Price Preferences: Min $12 | High Value $50+ | Electronics Featured')
  console.log('─'.repeat(80))
  
  rankedProducts.forEach((item, index) => {
    const { product, score, breakdown } = item
    const price = product.price || 0
    const category = product.category || 'N/A'
    const priceFlag = Number(price) < PRODUCT_PREFERENCES.MIN_PRICE ? ' ❌LOW' :
                     Number(price) >= PRODUCT_PREFERENCES.HIGH_VALUE_THRESHOLD ? ' ✅HIGH' : ''
    const electronicsFlag = breakdown.categoryBoost > 0 ? ' 📱ELEC' : ''
    
    console.log(`${index + 1}. ${product.title?.substring(0, 35)}...`)
    console.log(`   Score: ${score.toFixed(3)} | Rating: ${product.rating || 'N/A'}⭐ | Reviews: ${product.reviews_count || 0} | Price: $${price}${priceFlag}${electronicsFlag}`)
    console.log(`   Category: ${category.substring(0, 20)}`)
    console.log(`   Breakdown: BS:${breakdown.bestSellerScore.toFixed(2)} R:${breakdown.ratingScore.toFixed(2)} RC:${breakdown.reviewScore.toFixed(2)} PV:${breakdown.priceScore.toFixed(2)} CB:${breakdown.categoryBoost.toFixed(2)}`)
    console.log()
  })
}
