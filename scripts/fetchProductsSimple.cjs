#!/usr/bin/env node

const dotenv = require('dotenv')
const { createClient } = require('@supabase/supabase-js')
const Redis = require('ioredis')

// Load environment variables
dotenv.config({ path: '.env.local' })

// Simple product categories
const CATEGORIES = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'home-garden', name: 'Home & Garden' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'health-beauty', name: 'Health & Beauty' },
  { id: 'sports-outdoors', name: 'Sports & Outdoors' },
  { id: 'books-media', name: 'Books & Media' },
  { id: 'toys-games', name: 'Toys & Games' },
  { id: 'automotive', name: 'Automotive' }
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

// Track API usage
let requestCount = 0

function parsePrice(priceString) {
  const cleanPrice = priceString.replace(/[$,]/g, '')
  const parsed = parseFloat(cleanPrice)
  return isNaN(parsed) ? 0 : parsed
}

async function searchCanopyProducts(query, limit = 20) {
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

    return results.map(product => ({
      title: product.title.substring(0, 255),
      description: product.bookDescription?.substring(0, 1000) || product.featureBullets?.join(' ')?.substring(0, 1000) || null,
      price: product.price ? parsePrice(product.price.display) : 0,
      image_url: product.mainImageUrl || null,
      affiliate_url: product.url || `https://www.amazon.com/dp/${product.asin}?tag=${STORE_ID}`,
      store: product.brand || 'Amazon',
      category: 'electronics', // Default category for search
      brand: product.brand || null,
      rating: product.rating || null,
      reviews_count: product.reviewsTotal || 0,
      is_featured: false,
      is_trending: Math.random() > 0.7,
      created_at: now,
      updated_at: now
    }))
  } catch (error) {
    console.error('Error searching products:', error)
    throw error
  }
}

async function getProductsByCategory(categoryId, limit = 15) {
  const categoryQueries = {
    'electronics': 'electronics gadgets tech devices',
    'home-garden': 'home kitchen garden tools furniture',
    'fashion': 'clothing shoes fashion apparel accessories',
    'health-beauty': 'health beauty skincare cosmetics supplements',
    'sports-outdoors': 'sports fitness outdoor camping exercise',
    'books-media': 'books kindle audiobooks media entertainment',
    'toys-games': 'toys games kids children educational',
    'automotive': 'automotive car parts accessories tools',
  }

  const searchQuery = categoryQueries[categoryId] || categoryId
  const products = await searchCanopyProducts(searchQuery, limit)
  
  // Set correct category for all products
  return products.map(product => ({
    ...product,
    category: categoryId
  }))
}

async function insertProductsToSupabase(products) {
  try {
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

    return data
  } catch (error) {
    console.error('Error inserting products to Supabase:', error)
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
    console.error('Error clearing cache:', error)
  }
}

async function fetchAndStoreProducts(options = {}) {
  const {
    categories = CATEGORIES.map(cat => cat.id),
    productsPerCategory = 10,
    searchQuery,
    featured = false
  } = options

  console.log('🚀 Starting product fetch...')
  console.log(`📊 API requests made so far: ${requestCount}/100`)

  let totalProducts = 0
  const errors = []

  try {
    if (searchQuery) {
      console.log(`🔍 Searching for: "${searchQuery}"`)
      
      const products = await searchCanopyProducts(searchQuery, productsPerCategory * 2)
      console.log(`📦 Found ${products.length} products`)
      
      if (products.length > 0) {
        // Mark as featured if requested
        if (featured) {
          products.forEach(product => {
            product.is_featured = true
          })
        }
        
        const data = await insertProductsToSupabase(products)
        console.log(`✅ Inserted ${data?.length || 0} products`)
        totalProducts += data?.length || 0
      }
    } else {
      // Fetch by categories
      for (const categoryId of categories) {
        const category = CATEGORIES.find(cat => cat.id === categoryId)
        if (!category) {
          console.warn(`⚠️  Category "${categoryId}" not found, skipping...`)
          continue
        }

        console.log(`📂 Fetching products for category: ${category.name}`)
        
        try {
          const products = await getProductsByCategory(categoryId, productsPerCategory)
          console.log(`📦 Found ${products.length} products`)
          
          if (products.length > 0) {
            // Mark as featured if requested
            if (featured) {
              products.forEach(product => {
                product.is_featured = true
              })
            }
            
            const data = await insertProductsToSupabase(products)
            console.log(`✅ Inserted ${data?.length || 0} products for ${category.name}`)
            totalProducts += data?.length || 0
          }
          
          // Small delay to be respectful to the API
          await new Promise(resolve => setTimeout(resolve, 1000))
          
        } catch (error) {
          console.error(`❌ Error with ${category.name}:`, error.message)
          errors.push(`${category.name}: ${error.message}`)
        }
      }
    }

    // Clear cache
    await clearCache()

    // Summary
    console.log('\\n📊 FETCH SUMMARY:')
    console.log(`✅ Total products processed: ${totalProducts}`)
    console.log(`📈 API requests used: ${requestCount}/100`)
    
    if (errors.length > 0) {
      console.log(`❌ Errors: ${errors.length}`)
      errors.forEach(error => console.log(`   • ${error}`))
    }

    console.log('🎉 Product fetch completed!')
    
  } catch (error) {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🛍️  Bargainly Product Fetcher

Usage: node scripts/fetchProductsSimple.cjs [options]

Options:
  -c, --categories <list>     Comma-separated categories (${CATEGORIES.map(c => c.id).join(', ')})
  -n, --count <number>        Products per category (default: 10)
  -s, --search <query>        Search for specific products
  -f, --featured              Mark products as featured
  -h, --help                  Show this help

Examples:
  node scripts/fetchProductsSimple.cjs --search "wireless headphones"
  node scripts/fetchProductsSimple.cjs --categories electronics,fashion --count 15
  node scripts/fetchProductsSimple.cjs --categories home-garden --featured
    `)
    process.exit(0)
  }
  
  const options = {}
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--categories':
      case '-c':
        options.categories = args[i + 1]?.split(',').map(c => c.trim())
        i++
        break
      case '--count':
      case '-n':
        options.productsPerCategory = parseInt(args[i + 1]) || 10
        i++
        break
      case '--search':
      case '-s':
        options.searchQuery = args[i + 1]
        i++
        break
      case '--featured':
      case '-f':
        options.featured = true
        break
    }
  }
  
  await fetchAndStoreProducts(options)
  process.exit(0)
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  })
}
