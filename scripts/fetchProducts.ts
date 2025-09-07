#!/usr/bin/env ts-node

import { config } from 'dotenv'
import { supabaseAdmin } from '../lib/api/supabase.js'
import { 
  canopySearchProducts, 
  getCanopyProductsByCategory, 
  getApiUsage,
  incrementApiUsage,
  type CanopyProduct 
} from '../lib/api/canopy.js'
import { CATEGORIES } from '../lib/constants.js'
import { CacheUtils } from '../lib/redis.js'

// Load environment variables
config({ path: '.env.local' })

interface ProductInsert {
  title: string
  description?: string | null
  price: number
  original_price?: number | null
  discount_percentage?: number | null
  image_url?: string | null
  affiliate_url: string
  store: string
  category: string
  brand?: string | null
  rating?: number | null
  reviews_count?: number | null
  is_featured: boolean
  is_trending: boolean
}

function parsePrice(priceString: string): number {
  // Extract numeric value from price string like "$99.99" or "$1,299.00"
  const cleanPrice = priceString.replace(/[$,]/g, '')
  const parsed = parseFloat(cleanPrice)
  return isNaN(parsed) ? 0 : parsed
}

function convertCanopyToSupabase(canopyProduct: CanopyProduct, category: string, isFeatured: boolean = false): ProductInsert {
  const price = parsePrice(canopyProduct.price)
  
  return {
    title: canopyProduct.title.substring(0, 255), // Truncate if too long
    description: canopyProduct.description?.substring(0, 1000) || null, // Limit description length
    price,
    original_price: null, // Canopy doesn't provide original price directly
    discount_percentage: null, // Would need to calculate if originalPrice was available
    image_url: canopyProduct.mainImageUrl || null,
    affiliate_url: canopyProduct.affiliateUrl,
    store: canopyProduct.vendor || 'Amazon',
    category,
    brand: canopyProduct.vendor || null,
    rating: canopyProduct.rating || null,
    reviews_count: canopyProduct.reviewCount || 0,
    is_featured: isFeatured,
    is_trending: Math.random() > 0.7, // Randomly mark ~30% as trending
  }
}

async function fetchAndStoreProducts(options: {
  categories?: string[]
  productsPerCategory?: number
  featuredOnly?: boolean
  searchQuery?: string
}) {
  const {
    categories = CATEGORIES.map(cat => cat.id),
    productsPerCategory = 10,
    featuredOnly = false,
    searchQuery
  } = options

  console.log('🚀 Starting product fetch...')
  console.log('📊 Current API usage:', getApiUsage())

  if (!supabaseAdmin) {
    throw new Error('❌ Supabase admin client not initialized. Check SUPABASE_SERVICE_ROLE_KEY in .env.local')
  }

  let totalProducts = 0
  const errors: string[] = []

  try {
    if (searchQuery) {
      // Fetch products by search query
      console.log(`🔍 Searching for: "${searchQuery}"`)
      
      const products = await canopySearchProducts(searchQuery, productsPerCategory * 2)
      incrementApiUsage()
      
      console.log(`📦 Found ${products.length} products for search: "${searchQuery}"`)
      
      if (products.length > 0) {
        const supabaseProducts = products.map(product => 
          convertCanopyToSupabase(product, 'electronics', featuredOnly)
        )
        
        const { data, error } = await supabaseAdmin
          .from('products')
          .upsert(supabaseProducts, { 
            onConflict: 'affiliate_url',
            ignoreDuplicates: false 
          })
          .select()
          
        if (error) {
          console.error('❌ Error inserting products:', error)
          errors.push(`Search "${searchQuery}": ${error.message}`)
        } else {
          console.log(`✅ Inserted ${data?.length || 0} products for search: "${searchQuery}"`)
          totalProducts += data?.length || 0
        }
      }
    } else {
      // Fetch products by categories
      for (const categoryId of categories) {
        const category = CATEGORIES.find(cat => cat.id === categoryId)
        if (!category) {
          console.warn(`⚠️  Category "${categoryId}" not found, skipping...`)
          continue
        }

        console.log(`📂 Fetching products for category: ${category.name}`)
        
        try {
          const products = await getCanopyProductsByCategory(categoryId, productsPerCategory)
          incrementApiUsage()
          
          console.log(`📦 Found ${products.length} products for ${category.name}`)
          
          if (products.length > 0) {
            const supabaseProducts = products.map(product => 
              convertCanopyToSupabase(product, categoryId, featuredOnly)
            )
            
            const { data, error } = await supabaseAdmin
              .from('products')
              .upsert(supabaseProducts, { 
                onConflict: 'affiliate_url',
                ignoreDuplicates: false 
              })
              .select()
              
            if (error) {
              console.error(`❌ Error inserting products for ${category.name}:`, error)
              errors.push(`${category.name}: ${error.message}`)
            } else {
              console.log(`✅ Inserted ${data?.length || 0} products for ${category.name}`)
              totalProducts += data?.length || 0
            }
          }
          
          // Small delay to be respectful to the API
          await new Promise(resolve => setTimeout(resolve, 500))
          
        } catch (error) {
          console.error(`❌ Error fetching products for ${category.name}:`, error)
          errors.push(`${category.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    }

    // Clear relevant caches
    console.log('🧹 Clearing caches...')
    await CacheUtils.invalidateProducts()
    await CacheUtils.invalidateSearchResults()

    // Final summary
    console.log('\n📊 FETCH SUMMARY:')
    console.log(`✅ Total products processed: ${totalProducts}`)
    console.log(`📈 API usage after fetch:`, getApiUsage())
    
    if (errors.length > 0) {
      console.log(`❌ Errors encountered: ${errors.length}`)
      errors.forEach(error => console.log(`   • ${error}`))
    }

    console.log('🎉 Product fetch completed!')
    
  } catch (error) {
    console.error('💥 Fatal error during product fetch:', error)
    process.exit(1)
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)
  
  // Parse command line arguments
  const options: {
    categories?: string[]
    productsPerCategory?: number
    featuredOnly?: boolean
    searchQuery?: string
  } = {}
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    
    switch (arg) {
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
      case '--featured':
      case '-f':
        options.featuredOnly = true
        break
      case '--search':
      case '-s':
        options.searchQuery = args[i + 1]
        i++
        break
      case '--help':
      case '-h':
        console.log(`
🛍️  Bargainly Product Fetcher

Usage: npm run fetch-products [options]

Options:
  -c, --categories <list>     Comma-separated list of categories to fetch
                              Available: ${CATEGORIES.map(c => c.id).join(', ')}
                              Default: all categories
  
  -n, --count <number>        Number of products per category (default: 10)
  
  -f, --featured             Mark all fetched products as featured
  
  -s, --search <query>       Search for products instead of fetching by category
  
  -h, --help                 Show this help message

Examples:
  npm run fetch-products
  npm run fetch-products -- --categories electronics,fashion --count 15
  npm run fetch-products -- --search "wireless headphones" --featured
  npm run fetch-products -- --categories home-garden --count 20 --featured
        `)
        process.exit(0)
        break
    }
  }
  
  await fetchAndStoreProducts(options)
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  })
}

export { fetchAndStoreProducts }
