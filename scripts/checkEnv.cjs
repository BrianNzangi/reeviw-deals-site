const dotenv = require('dotenv')

// Load environment variables
dotenv.config({ path: '.env.local' })

console.log('🔍 Checking environment configuration...\n')

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'REDIS_URL',
  'CANOPY_API_KEY',
  'CANOPY_STORE_ID'
]

const optionalEnvVars = [
  'BREVO_API_KEY',
  'FROM_EMAIL'
]

let allGood = true

console.log('✅ Required Environment Variables:')
requiredEnvVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`   ✓ ${varName}: ${value.length > 50 ? value.substring(0, 50) + '...' : value}`)
  } else {
    console.log(`   ❌ ${varName}: NOT SET`)
    allGood = false
  }
})

console.log('\n📋 Optional Environment Variables:')
optionalEnvVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`   ✓ ${varName}: ${value.length > 50 ? value.substring(0, 50) + '...' : value}`)
  } else {
    console.log(`   ⚠️  ${varName}: not set (optional)`)
  }
})

if (allGood) {
  console.log('\n🎉 All required environment variables are set!')
  console.log('\n🚀 You can now run:')
  console.log('   node scripts/fetchProductsSimple.js --help')
  console.log('   node scripts/fetchProductsSimple.js --search "headphones"')
  console.log('   node scripts/fetchProductsSimple.js --categories electronics --count 10')
} else {
  console.log('\n❌ Some required environment variables are missing.')
  console.log('Please check your .env.local file and ensure it has all required variables.')
  process.exit(1)
}
