#!/usr/bin/env node

const dotenv = require('dotenv')
const { createClient } = require('@supabase/supabase-js')

// Load environment variables
dotenv.config({ path: '.env.local' })

console.log('🔍 Database Diagnosis Tool')
console.log('=' .repeat(50))

// Initialize Supabase client
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

async function checkDatabase() {
  try {
    console.log('📊 Environment Check:')
    console.log(`- Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}`)
    console.log(`- Service Role Key: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}`)
    console.log('')

    // Test 1: Check if table exists
    console.log('🔍 Test 1: Checking if products table exists...')
    const { data: tableData, error: tableError } = await supabase
      .from('products')
      .select('count(*)')
      .limit(1)

    if (tableError) {
      console.log(`❌ Table Error: ${tableError.message}`)
      if (tableError.code === 'PGRST205') {
        console.log('💡 Solution: Create the products table using DATABASE_SETUP.md instructions')
        return
      }
    } else {
      console.log('✅ Products table exists!')
    }

    // Test 2: Count products
    console.log('')
    console.log('📊 Test 2: Counting products in database...')
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.log(`❌ Count Error: ${countError.message}`)
    } else {
      console.log(`📦 Total products in database: ${count}`)
      
      if (count === 0) {
        console.log('⚠️  Database is empty! The fetched products may not have been saved.')
      }
    }

    // Test 3: Sample some products
    if (count > 0) {
      console.log('')
      console.log('🔍 Test 3: Sampling products...')
      const { data: sampleData, error: sampleError } = await supabase
        .from('products')
        .select('id, title, price, store, category, created_at')
        .limit(5)

      if (sampleError) {
        console.log(`❌ Sample Error: ${sampleError.message}`)
      } else {
        console.log('📋 Sample products:')
        sampleData.forEach((product, index) => {
          console.log(`  ${index + 1}. ${product.title.substring(0, 50)}...`)
          console.log(`     Price: $${product.price} | Store: ${product.store} | Category: ${product.category}`)
        })
      }
    }

    // Test 4: Check featured products
    console.log('')
    console.log('🌟 Test 4: Checking featured products...')
    const { data: featuredData, count: featuredCount, error: featuredError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true)

    if (featuredError) {
      console.log(`❌ Featured Error: ${featuredError.message}`)
    } else {
      console.log(`⭐ Featured products: ${featuredCount}`)
    }

    // Test 5: Test API endpoint
    console.log('')
    console.log('🌐 Test 5: Testing API endpoint...')
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products?limit=1`
      console.log(`Fetching: ${apiUrl}`)
      
      const response = await fetch(apiUrl)
      if (response.ok) {
        const apiData = await response.json()
        console.log(`✅ API responded with ${apiData.products?.length || 0} products`)
        if (apiData.products?.length > 0) {
          console.log(`   Sample: ${apiData.products[0].title?.substring(0, 40)}...`)
        }
      } else {
        console.log(`❌ API Error: ${response.status} ${response.statusText}`)
        const errorText = await response.text()
        console.log(`   Response: ${errorText}`)
      }
    } catch (apiError) {
      console.log(`❌ API Connection Error: ${apiError.message}`)
    }

  } catch (error) {
    console.error('💥 Diagnosis failed:', error)
  }

  console.log('')
  console.log('🔚 Diagnosis complete!')
}

if (require.main === module) {
  checkDatabase()
}
