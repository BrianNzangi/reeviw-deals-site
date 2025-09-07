"use client"

import { FC } from "react"
import ProductCard from "./ProductCard"
import { Product } from "@/types/product"

interface ProductGridProps {
  products?: Product[]
  initialProducts?: Product[]
  categoryId?: string
  listingType?: string
}

const ProductGrid: FC<ProductGridProps> = ({ 
  products, 
  initialProducts
}) => {
  // Use either products or initialProducts
  const displayProducts = products || initialProducts || []
  
  if (displayProducts.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-500">No products found.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          gap-4
        "
      >
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductGrid