import { notFound } from "next/navigation"
import ProductGrid from "@/components/products/ProductGrid"
import CategoryFilter from "@/components/ui/CategoryFilter"
import { CATEGORIES } from "@/lib/constants"
import { Product } from "@/types/product"
import { createClient } from '@supabase/supabase-js'
import { Suspense } from "react"

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    console.log(`🔍 Fetching products for category: ${categoryId}`)
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', categoryId)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (error) {
      console.error('Supabase error:', error)
      return []
    }
    
    console.log(`✅ Found ${products?.length || 0} products for ${categoryId}`)
    
    // Transform data to match Product type
    return (products || []).map(product => ({
      id: product.id.toString(),
      title: product.title,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      mainImageUrl: product.image_url,
      affiliate_url: product.affiliate_url,
      link: product.affiliate_url,
      url: product.affiliate_url,
      store: product.store,
      vendor: product.store,
      brand: product.brand,
      category: product.category,
      rating: product.rating,
      reviews_count: product.reviews_count,
      is_featured: product.is_featured,
      is_trending: product.is_trending,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }))
  } catch (error) {
    console.error('Error fetching category products:', error)
    return []
  }
}

interface CategoryPageProps {
  params: {
    categoryId: string
  }
}

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    categoryId: category.id,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { categoryId } = await params
  const category = CATEGORIES.find(c => c.id === categoryId)
  
  if (!category) {
    return {
      title: "Category Not Found - Bargainly"
    }
  }

  return {
    title: `${category.name} Deals - Bargainly`,
    description: `Find the best ${category.name.toLowerCase()} deals, coupons, and discounts on Bargainly.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = await params
  
  // Get category data and products from database
  const category = CATEGORIES.find(c => c.id === categoryId)
  
  if (!category) {
    notFound()
  }
  
  const products = await getProductsByCategory(categoryId)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
        <p className="text-gray-600 mb-6">{category.description}</p>
        
        {/* Category Filter */}
        <Suspense fallback={<div className="h-12 bg-gray-100 animate-pulse rounded"></div>}>
          <CategoryFilter />
        </Suspense>
      </div>
      
      {/* Products Grid */}
      <ProductGrid initialProducts={products} categoryId={categoryId} />
    </div>
  )
}
