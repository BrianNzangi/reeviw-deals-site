'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface CategoryFilterProps {
  className?: string
}

export default function CategoryFilter({ 
  className = '' 
}: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'relevance')

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'discount', label: 'Highest Discount' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Best Rating' },
  ]

  const handleSortChange = (sortValue: string) => {
    setSelectedSort(sortValue)
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortValue)
    router.push(`?${params.toString()}`)
  }

  const handlePriceFilter = (min: number, max?: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('minPrice', min.toString())
    if (max) {
      params.set('maxPrice', max.toString())
    } else {
      params.delete('maxPrice')
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium text-gray-700">
          Sort by:
        </label>
        <select
          id="sort"
          value={selectedSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Price:</span>
        <div className="flex gap-2">
          <button
            onClick={() => handlePriceFilter(0, 25)}
            className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            Under $25
          </button>
          <button
            onClick={() => handlePriceFilter(25, 50)}
            className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            $25 - $50
          </button>
          <button
            onClick={() => handlePriceFilter(50, 100)}
            className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            $50 - $100
          </button>
          <button
            onClick={() => handlePriceFilter(100)}
            className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            Over $100
          </button>
        </div>
      </div>

      {/* Discount Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Discount:</span>
        <div className="flex gap-2">
          {[10, 25, 50].map((discount) => (
            <button
              key={discount}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('minDiscount', discount.toString())
                router.push(`?${params.toString()}`)
              }}
              className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              {discount}%+ Off
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => router.push(window.location.pathname)}
        className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800 underline"
      >
        Clear Filters
      </button>
    </div>
  )
}
