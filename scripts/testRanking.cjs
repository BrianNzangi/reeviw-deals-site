#!/usr/bin/env node

/**
 * Test script to validate the KPI-based ranking system
 * Run with: node scripts/testRanking.cjs
 */

const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dbfximvzbumnplqhsydg.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-key'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// KPI weights for ranking algorithm
const RANKING_WEIGHTS = {
  BEST_SELLERS: 0.40,      // 40% - is_trending/is_featured flags
  HIGH_RATING: 0.30,       // 30% - Product rating (1-5 stars)
  REVIEW_COUNT: 0.20,      // 20% - Number of reviews
  PRICE_VALUE: 0.10,       // 10% - Price value and competitiveness
}

// Price and category preferences
const PRODUCT_PREFERENCES = {
  MIN_PRICE: 12,           // Minimum price threshold for quality
  HIGH_VALUE_THRESHOLD: 50, // High value product threshold
  ELECTRONICS_BOOST: 0.15,  // Additional score boost for electronics
  LOW_PRICE_PENALTY: 0.5,   // Penalty multiplier for products below minimum
}

function calculateBestSellerScore(product) {
  let score = 0
  
  if (product.is_featured) score += 1.0
  if (product.is_trending) score += 0.7
  
  return Math.min(score, 1.0)
}

function calculateRatingScore(product) {
  const rating = product.rating || 0
  if (rating <= 0) return 0
  return (rating - 1) / 4
}

function calculateReviewScore(product, maxReviews) {
  const reviewCount = product.reviews_count || 0
  if (reviewCount <= 0 || maxReviews <= 0) return 0
  
  const logScore = Math.log(reviewCount + 1) / Math.log(maxReviews + 1)
  return Math.min(logScore, 1.0)
}

function calculatePriceValueScore(product, maxPrice, minPrice) {
  const price = product.price || 0
  
  if (price <= 0 || maxPrice <= minPrice) return 0
  
  let score = 0
  
  // Base competitiveness score
  const priceRange = maxPrice - minPrice
  const normalizedPrice = (price - minPrice) / priceRange
  const competitivenessScore = Math.max(0, 1 - normalizedPrice)
  
  // Quality threshold scoring
  if (price < PRODUCT_PREFERENCES.MIN_PRICE) {
    score = competitivenessScore * PRODUCT_PREFERENCES.LOW_PRICE_PENALTY
  } else if (price >= PRODUCT_PREFERENCES.HIGH_VALUE_THRESHOLD) {
    score = Math.min(1.0, competitivenessScore + 0.3)
  } else {
    score = competitivenessScore
  }
  
  return Math.min(1.0, Math.max(0, score))
}

function calculateCategoryBoost(product) {
  const category = product.category?.toLowerCase() || ''
  
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

function rankProducts(products) {
  if (!products || products.length === 0) return []
  
  const prices = products.map(p => p.price || 0).filter(p => p > 0)
  const reviewCounts = products.map(p => p.reviews_count || 0)
  
  const maxPrice = Math.max(...prices, 1)
  const minPrice = Math.min(...prices, 0)
  const maxReviews = Math.max(...reviewCounts, 1)
  
  const scoredProducts = products.map(product => {
    const bestSellerScore = calculateBestSellerScore(product)
    const ratingScore = calculateRatingScore(product)
    const reviewScore = calculateReviewScore(product, maxReviews)
    const priceValueScore = calculatePriceValueScore(product, maxPrice, minPrice)
    const categoryBoost = calculateCategoryBoost(product)
    
    const baseScore = 
      bestSellerScore * RANKING_WEIGHTS.BEST_SELLERS +
      ratingScore * RANKING_WEIGHTS.HIGH_RATING +
      reviewScore * RANKING_WEIGHTS.REVIEW_COUNT +
      priceValueScore * RANKING_WEIGHTS.PRICE_VALUE
    
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
  })
  
  return scoredProducts.sort((a, b) => b.score - a.score)
}

async function testRanking() {
  try {
    console.log('🚀 Testing KPI-based Product Ranking System')
    console.log('═'.repeat(80))
    
    // Fetch products from database
    console.log('📊 Fetching products from database...')
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(50)
    
    if (error) {
      console.error('❌ Database error:', error)
      return
    }
    
    if (!products || products.length === 0) {
      console.log('⚠️  No products found in database')
      return
    }
    
    console.log(`✅ Found ${products.length} products`)
    
    // Analyze product data
    const withRating = products.filter(p => p.rating && p.rating > 0).length
    const withReviews = products.filter(p => p.reviews_count && p.reviews_count > 0).length
    const featured = products.filter(p => p.is_featured).length
    const trending = products.filter(p => p.is_trending).length
    const withPrice = products.filter(p => p.price && p.price > 0).length
    
    console.log('\\n📈 Data Quality Analysis:')
    console.log(`   Products with ratings: ${withRating}/${products.length} (${((withRating/products.length)*100).toFixed(1)}%)`)
    console.log(`   Products with reviews: ${withReviews}/${products.length} (${((withReviews/products.length)*100).toFixed(1)}%)`)
    console.log(`   Featured products: ${featured}/${products.length} (${((featured/products.length)*100).toFixed(1)}%)`)
    console.log(`   Trending products: ${trending}/${products.length} (${((trending/products.length)*100).toFixed(1)}%)`)
    console.log(`   Products with prices: ${withPrice}/${products.length} (${((withPrice/products.length)*100).toFixed(1)}%)`)
    
    // Rank products
    console.log('\\n🏆 Ranking Products by KPI Scores with Preferences...')
    console.log('Weights: Best Sellers 40% | Rating 30% | Reviews 20% | Price Value 10% + Electronics Boost 15%')
    console.log('Price Preferences: Min $12 | High Value $50+ | Electronics Featured')
    console.log('─'.repeat(80))
    
    const rankedProducts = rankProducts(products)
    const topProducts = rankedProducts.slice(0, 15)
    
    topProducts.forEach((item, index) => {
      const { product, score, breakdown } = item
      const title = product.title ? product.title.substring(0, 40) + '...' : 'No title'
      const rating = product.rating || 'N/A'
      const reviews = product.reviews_count || 0
      const price = product.price || 0
      const category = product.category || 'N/A'
      
      const flags = []
      if (product.is_featured) flags.push('Featured')
      if (product.is_trending) flags.push('Trending')
      const flagStr = flags.length > 0 ? ` [${flags.join(', ')}]` : ''
      
      const priceFlag = price < PRODUCT_PREFERENCES.MIN_PRICE ? ' ❌LOW' : 
                       price >= PRODUCT_PREFERENCES.HIGH_VALUE_THRESHOLD ? ' ✅HIGH' : ''
      const electronicsFlag = breakdown.categoryBoost > 0 ? ' 📱ELEC' : ''
      
      console.log(`${(index + 1).toString().padStart(2, ' ')}. ${title}`)
      console.log(`    Score: ${score.toFixed(3)} | Rating: ${rating}⭐ | Reviews: ${reviews} | Price: $${price}${priceFlag}${electronicsFlag}${flagStr}`)
      console.log(`    Category: ${category.substring(0, 25)}`)
      console.log(`    Breakdown: BS:${breakdown.bestSellerScore.toFixed(2)} R:${breakdown.ratingScore.toFixed(2)} RC:${breakdown.reviewScore.toFixed(2)} PV:${breakdown.priceScore.toFixed(2)} CB:${breakdown.categoryBoost.toFixed(2)}`)
      console.log()
    })
    
    // Score distribution analysis
    const scores = rankedProducts.map(item => item.score)
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
    const maxScore = Math.max(...scores)
    const minScore = Math.min(...scores)
    
    console.log('📊 Score Distribution:')
    console.log(`   Average Score: ${avgScore.toFixed(3)}`)
    console.log(`   Highest Score: ${maxScore.toFixed(3)}`)
    console.log(`   Lowest Score: ${minScore.toFixed(3)}`)
    console.log(`   Score Range: ${(maxScore - minScore).toFixed(3)}`)
    
    console.log('\\n✅ Ranking test completed successfully!')
    
  } catch (error) {
    console.error('❌ Error testing ranking:', error)
  }
}

// Run the test
if (require.main === module) {
  testRanking()
}
