import ListingFilter from "@/components/ui/ListingFilter"
import ProductGrid from "@/components/products/ProductGrid"
import VerticalAd from "@/components/ads/VerticalAd"
import type { Product } from "@/types/product"
import { Suspense } from "react"

export const metadata = {
  title: "Curated Listings - Bargainly",
  description: "Hand-picked deals and products curated by our team.",
}

export default function ListingsPage() {
  const curatedListings: Product[] = []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Curated Listings</h1>
        <p className="text-gray-600 mb-6">
          Hand-picked deals and products carefully curated by our team of deal hunters
        </p>
        
        {/* Listing Filter */}
        <Suspense fallback={<div className="h-12 bg-gray-100 animate-pulse rounded"></div>}>
          <ListingFilter />
        </Suspense>
      </div>
      
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1">
          {/* Curated Products */}
          <ProductGrid 
            initialProducts={curatedListings} 
            listingType="curated"
          />
        </div>
        
        {/* Sidebar - Vertical Ad */}
        <div className="w-80 hidden lg:block">
          <VerticalAd />
        </div>
      </div>
      
      {/* Info Section */}
      <div className="mt-16 bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">About Our Curated Listings</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Quality First</h3>
            <p className="text-gray-600">
              Every product in our curated listings has been personally reviewed 
              and tested by our team to ensure quality and value.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Best Deals Only</h3>
            <p className="text-gray-600">
              We only include products that offer genuine value and significant 
              savings compared to regular retail prices.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Updated Daily</h3>
            <p className="text-gray-600">
              Our curation team updates these listings daily to ensure you always 
              see the freshest and most relevant deals.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Expert Recommended</h3>
            <p className="text-gray-600">
              Each product is selected based on expert knowledge of market trends, 
              customer reviews, and real-world testing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
