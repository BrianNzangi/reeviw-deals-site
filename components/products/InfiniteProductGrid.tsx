"use client"

import { FC, useState, useEffect, useCallback } from "react"
import ProductCard from "./ProductCard"
import { Product } from "@/types/product"

interface InfiniteProductGridProps {
  initialProducts: Product[]
  categoryId?: string
  featured?: boolean
}

const InfiniteProductGrid: FC<InfiniteProductGridProps> = ({ 
  initialProducts,
  categoryId,
  featured = false
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialProducts.length >= 20) // Only enable infinite scroll if we got a full page
  const [page, setPage] = useState(Math.ceil(initialProducts.length / 20) + 1) // Calculate starting page based on initial products
  const [totalProducts, setTotalProducts] = useState<number | null>(null) // Track total available products

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      })
      
      if (categoryId) {
        params.append('category', categoryId)
      }
      
      if (featured) {
        params.append('featured', 'true')
      }

      const response = await fetch(`/api/products?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      const newProducts = data.products || []
      
      // Update total products count from API response
      if (data.pagination?.total && !totalProducts) {
        setTotalProducts(data.pagination.total)
      }

      if (newProducts.length === 0) {
        setHasMore(false)
      } else {
        setProducts(prev => [...prev, ...newProducts])
        setPage(prev => prev + 1)
        
        // Check if we have more based on pagination info
        if (data.pagination?.hasMore === false) {
          setHasMore(false)
        }
      }
    } catch (error) {
      console.error('Error loading more products:', error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, categoryId, featured, totalProducts])

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return

      const scrollTop = document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight

      // Load more when user is 100px from bottom
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreProducts()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMoreProducts, loading, hasMore])

  if (products.length === 0 && !loading) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-500">No products found.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading more products...</span>
        </div>
      )}

      {/* End of results */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">You&apos;ve reached the end! 🎉</p>
          <p className="text-sm text-gray-400 mt-1">
            Showing all {totalProducts || products.length} products
          </p>
        </div>
      )}

      {/* Load more button (fallback for manual loading) */}
      {hasMore && !loading && products.length > 0 && (
        <div className="text-center py-8">
          <button
            onClick={loadMoreProducts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  )
}

export default InfiniteProductGrid
