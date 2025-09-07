#!/usr/bin/env node

/**
 * Premium Product Fetcher - Targets high-priority electronics and discounted products
 * Usage: node scripts/fetchPremiumProducts.cjs [options]
 * 
 * Examples:
 * node scripts/fetchPremiumProducts.cjs --electronics --count 20
 * node scripts/fetchPremiumProducts.cjs --discounts --count 15
 * node scripts/fetchPremiumProducts.cjs --all --count 30
 */

const dotenv = require('dotenv')
const { createClient } = require('@supabase/supabase-js')
const Redis = require('ioredis')

// Load environment variables
dotenv.config({ path: '.env.local' })

// Premium electronics categories and search terms
const PREMIUM_ELECTRONICS = {
  computers: {
    category: 'computers',
    searchTerms: [
      'laptop computer macbook',
      'desktop computer PC gaming',
      'workstation computer professional',
      'ultrabook thin laptop premium',
      'gaming laptop high performance'
    ]
  },
  phones: {
    category: 'phones',
    searchTerms: [
      'iPhone smartphone premium',
      'Samsung Galaxy phone flagship',
      'Google Pixel smartphone',
      'smartphone 5G flagship premium',
      'mobile phone unlocked latest'
    ]
  },
  laptops: {
    category: 'laptops', 
    searchTerms: [
      'laptop premium ultrabook',
      'gaming laptop RTX graphics',
      'business laptop professional',
      'macbook air pro laptop',
      'laptop SSD high performance'
    ]
  },
  tablets: {
    category: 'tablets',
    searchTerms: [
      'iPad tablet premium Apple',
      'Samsung Galaxy tablet',
      'Microsoft Surface tablet',
      'Android tablet premium',
      'tablet stylus professional'
    ]
  },
  gaming: {
    category: 'gaming',
    searchTerms: [
      'gaming console PlayStation Xbox',
      'gaming headset premium',
      'mechanical gaming keyboard',
      'gaming mouse RGB',
      'VR headset virtual reality'
    ]
  },
  audio: {
    category: 'audio',
    searchTerms: [
      'wireless headphones premium',
      'noise cancelling headphones',
      'bluetooth speaker premium',
      'audiophile headphones',
      'sound system home audio'
    ]
  }
}

// Discount-focused search terms
const DISCOUNT_SEARCHES = [
  'sale clearance discount electronics',
  'deal of the day electronics',
  'lightning deal electronics',
  'refurbished electronics certified',
  'open box electronics discount',
  'warehouse deal electronics',
  'flash sale electronics',
  'best buy sale electronics',
  'amazon sale electronics discounted'
]

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

const redis = new Redis(process.env.REDIS_URL, {
  tls: {},
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 1000,
})

// Canopy API setup
const API_KEY = process.env.CANOPY_API_KEY
const STORE_ID = process.env.CANOPY_STORE_ID

const headers = {
  'Content-Type': 'application/json',
  'API-KEY': API_KEY,
  'StoreID': STORE_ID,
}

let requestCount = 0

function parsePrice(priceString) {
  if (!priceString) return 0
  const cleanPrice = priceString.replace(/[$,]/g, '')
  const parsed = parseFloat(cleanPrice)
  return isNaN(parsed) ? 0 : parsed
}

function hasDiscount(product) {
  // Check for discount indicators in title or description
  const text = `${product.title} ${product.bookDescription || ''}`.toLowerCase()
  const discountKeywords = [
    'sale', 'discount', 'off', 'deal', 'clearance', 'reduced',
    'was', 'now', 'save', 'special', 'limited time', 'flash',
    'warehouse', 'open box', 'refurbished', 'certified'
  ]
  
  return discountKeywords.some(keyword => text.includes(keyword))
}

async function searchCanopyProducts(query, category, limit = 20) {
  const searchQuery = `
    query {
      amazonProductSearchResults(input: { searchTerm: "${query}" }) {
        productResults {
          results {
            asin
            title
            mainImageUrl
            rating
            price { display }
            brand
            bookDescription
            featureBullets
            categories {
              name
            }
            reviewsTotal
            url
            isPrime
          }
          pageInfo {
            currentPage
            totalPages
            hasNextPage
          }
        }
      }
    }
  `

  try {
    console.log(`🔍 Searching: "${query}" in ${category}...`)
    
    const response = await fetch('https://graphql.canopyapi.co/', {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: searchQuery }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()
    
    if (json.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
    }

    requestCount++
    const results = json.data.amazonProductSearchResults.productResults.results
    const now = new Date().toISOString()

    const products = results.map(product => {
      const price = product.price ? parsePrice(product.price.display) : 0
      const isDiscounted = hasDiscount(product)
      
      return {
        title: product.title.substring(0, 255),
        description: product.bookDescription?.substring(0, 1000) || 
                    product.featureBullets?.join(' ')?.substring(0, 1000) || null,
        price: price,
        image_url: product.mainImageUrl || null,
        affiliate_url: product.url || `https://www.amazon.com/dp/${product.asin}?tag=${STORE_ID}`,
        store: product.brand || 'Amazon',
        category: category,
        brand: product.brand || null,
        rating: product.rating || null,
        reviews_count: product.reviewsTotal || 0,
        is_featured: price >= 50, // High value products are featured
        is_trending: isDiscounted || Math.random() > 0.6, // Discounted products trend
        created_at: now,
        updated_at: now
      }
    })

    // Filter for quality and preferences
    const qualityProducts = products.filter(product => {
      return product.price >= 12 && // Minimum price threshold
             product.title.length > 10 && // Quality title
             product.image_url // Must have image
    })

    console.log(`   ✅ Found ${qualityProducts.length}/${products.length} quality products`)
    return qualityProducts

  } catch (error) {
    console.error(`❌ Error searching "${query}":`, error.message)
    return []
  }
}

async function fetchElectronicsProducts(count = 50) {
  console.log('📱 Fetching Premium Electronics Products...')
  console.log('Categories: computers, phones, laptops, tablets, gaming, audio')
  console.log('=' .repeat(80))

  const allProducts = []
  const productsPerCategory = Math.ceil(count / Object.keys(PREMIUM_ELECTRONICS).length)

  for (const [categoryKey, categoryData] of Object.entries(PREMIUM_ELECTRONICS)) {
    console.log(`\\n🎯 Category: ${categoryKey.toUpperCase()}`)
    
    const categoryProducts = []
    const searchesPerTerm = Math.ceil(productsPerCategory / categoryData.searchTerms.length)

    for (const searchTerm of categoryData.searchTerms) {
      try {
        const products = await searchCanopyProducts(
          searchTerm, 
          categoryData.category, 
          searchesPerTerm
        )
        categoryProducts.push(...products)
        
        // Rate limit protection
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`   ❌ Failed search: ${searchTerm}`)
      }
    }

    // Remove duplicates by affiliate_url
    const uniqueProducts = categoryProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.affiliate_url === product.affiliate_url)
    )

    console.log(`   📦 Collected ${uniqueProducts.length} unique products`)
    allProducts.push(...uniqueProducts.slice(0, productsPerCategory))
  }

  return allProducts
}

async function fetchDiscountedProducts(count = 30) {
  console.log('\\n💰 Fetching Discounted Products...')
  console.log('Focus: Sales, deals, clearance, refurbished items')
  console.log('=' .repeat(80))

  const allProducts = []
  const productsPerSearch = Math.ceil(count / DISCOUNT_SEARCHES.length)

  for (const searchTerm of DISCOUNT_SEARCHES) {
    try {
      const products = await searchCanopyProducts(
        searchTerm, 
        'electronics', // Default to electronics for discounts
        productsPerSearch
      )
      
      // Boost trending flag for discounted products
      const discountedProducts = products.map(product => ({
        ...product,
        is_trending: true, // All discount products are trending
        is_featured: product.price >= 25 // Lower threshold for featured discounts
      }))
      
      allProducts.push(...discountedProducts)
      
      // Rate limit protection
      await new Promise(resolve => setTimeout(resolve, 1200))
      
    } catch (error) {
      console.error(`   ❌ Failed search: ${searchTerm}`)
    }
  }

  // Remove duplicates
  const uniqueProducts = allProducts.filter((product, index, self) => 
    index === self.findIndex(p => p.affiliate_url === product.affiliate_url)
  )

  console.log(`💎 Found ${uniqueProducts.length} unique discounted products`)
  return uniqueProducts
}

async function insertProductsToSupabase(products) {
  if (products.length === 0) {
    console.log('⚠️  No products to insert')
    return []
  }

  try {
    console.log(`\\n💾 Inserting ${products.length} products to database...`)
    
    const { data, error } = await supabase
      .from('products')
      .upsert(products, { 
        onConflict: 'affiliate_url',
        ignoreDuplicates: false 
      })
      .select()
      
    if (error) {
      throw error
    }

    console.log(`✅ Successfully inserted/updated ${data?.length || 0} products`)
    return data || []
    
  } catch (error) {
    console.error('❌ Error inserting products:', error)
    throw error
  }
}

async function clearCache() {
  try {
    const keys = await redis.keys('products:*')
    if (keys.length > 0) {
      await redis.del(...keys)
    }
    
    const searchKeys = await redis.keys('search:*')
    if (searchKeys.length > 0) {
      await redis.del(...searchKeys)
    }
    
    console.log('🧹 Cache cleared')
  } catch (error) {
    console.error('⚠️  Error clearing cache:', error)
  }
}

function showStats(products) {
  console.log('\\n📊 Product Statistics:')
  console.log('─'.repeat(50))
  
  const byCategory = {}
  const byPriceRange = { 'Under $25': 0, '$25-$50': 0, '$50-$100': 0, 'Over $100': 0 }
  let avgPrice = 0
  let avgRating = 0
  let totalWithRating = 0
  let featured = 0
  let trending = 0
  
  products.forEach(product => {
    // Category stats
    byCategory[product.category] = (byCategory[product.category] || 0) + 1
    
    // Price stats
    const price = product.price || 0
    if (price < 25) byPriceRange['Under $25']++
    else if (price < 50) byPriceRange['$25-$50']++
    else if (price < 100) byPriceRange['$50-$100']++
    else byPriceRange['Over $100']++
    
    avgPrice += price
    
    if (product.rating) {
      avgRating += product.rating
      totalWithRating++
    }
    
    if (product.is_featured) featured++
    if (product.is_trending) trending++
  })
  
  avgPrice = (avgPrice / products.length).toFixed(2)
  avgRating = totalWithRating > 0 ? (avgRating / totalWithRating).toFixed(1) : 'N/A'
  
  console.log(`Total Products: ${products.length}`)
  console.log(`Average Price: $${avgPrice}`)
  console.log(`Average Rating: ${avgRating}⭐`)
  console.log(`Featured Products: ${featured} (${((featured/products.length)*100).toFixed(1)}%)`)
  console.log(`Trending Products: ${trending} (${((trending/products.length)*100).toFixed(1)}%)`)
  
  console.log('\\nBy Category:')
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`)
  })
  
  console.log('\\nBy Price Range:')
  Object.entries(byPriceRange).forEach(([range, count]) => {
    console.log(`  ${range}: ${count}`)
  })
}

async function main() {
  const args = process.argv.slice(2)
  const options = {
    electronics: args.includes('--electronics'),
    discounts: args.includes('--discounts'),
    all: args.includes('--all'),
    count: parseInt(args.find(arg => arg.startsWith('--count='))?.split('=')[1]) ||
           parseInt(args[args.indexOf('--count') + 1]) || 50,
    clearCache: args.includes('--clear-cache')
  }

  try {
    console.log('🚀 Premium Product Fetcher')
    console.log('Target: High-priority electronics + discounted products')
    console.log('Price Threshold: Minimum $12, High-value $50+')
    console.log('═'.repeat(80))

    if (options.clearCache) {
      await clearCache()
    }

    let allProducts = []

    if (options.electronics || options.all) {
      const electronicsCount = options.all ? Math.floor(options.count * 0.7) : options.count
      const electronics = await fetchElectronicsProducts(electronicsCount)
      allProducts.push(...electronics)
    }

    if (options.discounts || options.all) {
      const discountCount = options.all ? Math.floor(options.count * 0.3) : options.count
      const discounted = await fetchDiscountedProducts(discountCount)
      allProducts.push(...discounted)
    }

    if (!options.electronics && !options.discounts && !options.all) {
      console.log('⚠️  No fetch type specified. Use --electronics, --discounts, or --all')
      console.log('\\nExamples:')
      console.log('  node scripts/fetchPremiumProducts.cjs --electronics --count 30')
      console.log('  node scripts/fetchPremiumProducts.cjs --discounts --count 20')
      console.log('  node scripts/fetchPremiumProducts.cjs --all --count 50')
      process.exit(1)
    }

    // Remove final duplicates across all products
    const uniqueProducts = allProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.affiliate_url === product.affiliate_url)
    )

    if (uniqueProducts.length === 0) {
      console.log('⚠️  No products fetched successfully')
      process.exit(1)
    }

    showStats(uniqueProducts)
    
    await insertProductsToSupabase(uniqueProducts)
    await clearCache()

    console.log('\\n🎉 Premium product fetch completed successfully!')
    console.log(`📈 API Requests Made: ${requestCount}`)
    console.log(`💾 Products Added/Updated: ${uniqueProducts.length}`)

  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  } finally {
    await redis.disconnect()
  }
}

// Run the script
if (require.main === module) {
  main()
}
