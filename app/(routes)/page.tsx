import InfiniteProductGrid from "@/components/products/InfiniteProductGrid"
import VerticalAd from "@/components/ads/VerticalAd"
import { Product } from "@/types/product"
import { createClient } from '@supabase/supabase-js'
import { getTopRankedProducts, debugProductRanking } from '@/lib/utils/productRanking'

// Initialize Supabase client for server-side data fetching
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

async function getInitialProducts(): Promise<Product[]> {
  try {
    console.log('Fetching initial products...')
    
    // Fetch directly from Supabase - get more products for initial load
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200) // Start with 200 products for homepage
    
    if (error) {
      console.error('Supabase error:', error)
      return []
    }
    
    console.log(`✅ Found ${products?.length || 0} products`)
    
    // Transform the data to match the Product type
    const transformedProducts: Product[] = (products || []).map(product => ({
      id: product.id.toString(),
      title: product.title,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      mainImageUrl: product.image_url, // Alias for compatibility
      affiliate_url: product.affiliate_url,
      link: product.affiliate_url, // Alias for compatibility
      url: product.affiliate_url, // Alias for compatibility  
      store: product.store,
      vendor: product.store, // Alias for compatibility
      brand: product.brand,
      category: product.category,
      rating: product.rating,
      reviews_count: product.reviews_count,
      is_featured: product.is_featured,
      is_trending: product.is_trending,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }))
    
    // Apply KPI-based ranking to surface best products first
    const rankedProducts = getTopRankedProducts(transformedProducts, 200)
    
    // Debug: Show top 10 products ranking in development
    if (process.env.NODE_ENV === 'development' && rankedProducts.length > 0) {
      debugProductRanking(rankedProducts, 10)
    }
    
    return rankedProducts
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function Home() {
  const initialProducts = await getInitialProducts()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Main content - Product Grid with infinite scroll */}
        <div className="flex-1">
          {initialProducts.length > 0 ? (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Reeviw Best Deals</h1>
                <p className="text-gray-600">
                  Discover the best products ad deals from top brands
                </p>
              </div>
              <InfiniteProductGrid initialProducts={initialProducts} />
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">No products available yet</h2>
              <p className="text-gray-600 mb-4">
                The products database needs to be set up. Please run the product fetching script to populate the database.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg text-left max-w-md mx-auto">
                <p className="text-sm font-mono">
                  node scripts/fetchProductsSimple.cjs --categories electronics,home-garden --count 10
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar - Vertical Ad */}
        <div className="w-80 hidden lg:block">
          <VerticalAd />
        </div>
      </div>
    </div>
  )
}
