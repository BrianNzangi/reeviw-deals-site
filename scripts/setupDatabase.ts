#!/usr/bin/env ts-node

import { config } from 'dotenv'
import { supabaseAdmin } from '../lib/api/supabase'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables
config({ path: '.env.local' })

async function setupDatabase() {
  console.log('🗃️  Setting up Supabase database...')

  if (!supabaseAdmin) {
    throw new Error('❌ Supabase admin client not initialized. Check SUPABASE_SERVICE_ROLE_KEY in .env.local')
  }

  try {
    // Read the schema file
    const schemaPath = join(__dirname, '../supabase/schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📝 Executing ${statements.length} SQL statements...`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql: statement })
        
        if (error) {
          console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message)
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      } catch (error) {
        console.warn(`⚠️  Warning on statement ${i + 1}:`, error instanceof Error ? error.message : 'Unknown error')
      }
    }

    console.log('✅ Database setup completed!')
    console.log('\n🎯 Next steps:')
    console.log('1. Run: npm run fetch-products -- --help (to see all options)')
    console.log('2. Run: npm run seed-db (to populate with sample products)')
    console.log('3. Run: npm run dev (to start your application)')

  } catch (error) {
    console.error('💥 Database setup failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  setupDatabase().catch(error => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  })
}
