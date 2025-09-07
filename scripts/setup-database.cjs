#!/usr/bin/env node

const dotenv = require('dotenv')
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
dotenv.config({ path: '.env.local' })

// Initialize Supabase client with service role key
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

async function setupDatabase() {
  try {
    console.log('🔧 Setting up Supabase database...')
    
    // Read SQL file
    const sqlPath = path.join(__dirname, 'setup-database.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    console.log('📝 Executing SQL script...')
    
    // Execute SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: sql
    })
    
    if (error) {
      console.error('❌ Error executing SQL:', error)
      
      // Try direct table creation as fallback
      console.log('🔄 Trying alternative approach...')
      
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS public.products (
            id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10,2),
            image_url TEXT,
            affiliate_url TEXT UNIQUE,
            store VARCHAR(100),
            brand VARCHAR(100),
            category VARCHAR(50),
            rating DECIMAL(3,2),
            reviews_count INTEGER DEFAULT 0,
            is_featured BOOLEAN DEFAULT FALSE,
            is_trending BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `
      })
      
      if (createError) {
        console.error('❌ Failed to create table with fallback approach:', createError)
        
        // If RPC doesn't work, let's try the REST API approach
        console.log('🔄 Trying REST API approach...')
        
        // Test if table exists by trying to fetch from it
        const { data: testData, error: testError } = await supabase
          .from('products')
          .select('id')
          .limit(1)
        
        if (testError && testError.code === 'PGRST106') {
          // Table doesn't exist
          console.log('📋 Table does not exist. You need to create it manually in Supabase.')
          console.log('🔗 Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor')
          console.log('📝 Run this SQL in the SQL editor:')
          console.log(sql)
          process.exit(1)
        } else if (testError) {
          console.error('❌ Unknown error checking table:', testError)
          process.exit(1)
        } else {
          console.log('✅ Products table already exists!')
        }
      } else {
        console.log('✅ Table created successfully with fallback approach!')
      }
    } else {
      console.log('✅ Database setup completed successfully!')
    }
    
    // Test the table
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count(*)')
      .single()
    
    if (testError) {
      console.error('❌ Error testing products table:', testError)
      console.log('\n📋 Manual Setup Instructions:')
      console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard')
      console.log('2. Open the SQL Editor')
      console.log('3. Run the SQL from scripts/setup-database.sql')
    } else {
      console.log('✅ Products table is working correctly!')
      console.log('📊 Current product count:', testData?.count || 0)
    }
    
  } catch (error) {
    console.error('💥 Setup failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  setupDatabase()
}
