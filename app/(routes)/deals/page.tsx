import Carousel from "@/components/ui/Carousel"
import ProductGrid2 from "@/components/products/ProductGrid2"
import VerticalAd from "@/components/ads/VerticalAd"
import { Product } from "@/types/product"
import { createClient } from '@supabase/supabase-js'
import Image from "next/image"


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

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) {
      console.error('Error fetching featured products:', error)
      return []
    }
    
    return (products || []).map(transformProduct)
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error)
    return []
  }
}

async function getAllDeals(): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (error) {
      console.error('Error fetching all deals:', error)
      return []
    }
    
    return (products || []).map(transformProduct)
  } catch (error) {
    console.error('Error in getAllDeals:', error)
    return []
  }
}

interface RawProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  affiliate_url: string;
  store: string;
  brand: string;
  category: string;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
}

function transformProduct(product: RawProduct): Product {
  return {
    id: product.id.toString(),
    title: product.title,
    description: product.description,
    price: product.price,
    image_url: product.image_url,
    mainImageUrl: product.image_url,
    imageUrl: product.image_url, // For compatibility with deals page
    affiliate_url: product.affiliate_url,
    link: product.affiliate_url,
    url: product.affiliate_url,
    affiliateUrl: product.affiliate_url, // For compatibility
    store: product.store,
    vendor: product.store,
    source: product.store?.toLowerCase(), // Convert store to source format
    brand: product.brand,
    category: product.category,
    rating: product.rating,
    reviews_count: product.reviews_count,
    is_featured: product.is_featured,
    is_trending: product.is_trending,
    isPrime: product.store?.toLowerCase() === 'amazon', // Simple heuristic
    created_at: product.created_at,
    updated_at: product.updated_at,
  }
}

export const metadata = {
  title: "Best Deals - Reeviw",
  description: "Discover the hottest deals from Amazon Prime, Walmart, Target and more.",
}

export default async function DealsPage() {
  const featuredDeals = await getFeaturedProducts()
  const allDeals = await getAllDeals()

  const dealCategories = [
    {
      title: "Amazon Deals",
      description: "Great deals from Amazon",
      source: "amazon",
      deals: allDeals.filter(deal => deal.store?.toLowerCase().includes('amazon'))
    },
    {
      title: "Brand Name Products",
      description: "Quality products from top brands",
      source: "brands", 
      deals: allDeals.filter(deal => deal.brand && !['Amazon', 'Generic'].includes(deal.brand))
    },
    {
      title: "Electronics",
      description: "Tech gadgets and electronics",
      source: "electronics",
      deals: allDeals.filter(deal => deal.category === 'electronics')
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 overflow-x-hidden">      
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
      
      {/* Featured Deals Carousel */}
      {featuredDeals.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Deals</h2>
          <Carousel items={featuredDeals} />
        </div>
      )}
      
      {/* Deal Categories */}
      {dealCategories.map((category) => (
        category.deals.length > 0 && (
          <div key={category.source} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{category.title}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View All →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.deals.slice(0, 8).map((deal) => (
                <div key={deal.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square relative bg-white">
                    <Image
                      src={deal.imageUrl ?? ""}
                      alt={deal.title}
                      width={200}
                      height={200}
                      className="w-full h-full object-contain px-8 py-8"
                    />
                    {deal.discount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                        -{deal.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {deal.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">
                          ${deal.price}
                        </span>
                        {deal.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${deal.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 capitalize">
                        {deal.source}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
      
          {/* All Deals Grid */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">All Deals</h2>
            <ProductGrid2 initialProducts={allDeals} />
          </div>
        </div>
        
        {/* Sidebar - Vertical Ad */}
        <div className="w-80 hidden lg:block">
          <VerticalAd />
        </div>
      </div>
    </div>
  )
}
