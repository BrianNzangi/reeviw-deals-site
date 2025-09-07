'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ListingFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all')
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'featured')

  const listingTypes = [
    { value: 'all', label: 'All Listings' },
    { value: 'featured', label: 'Featured Deals' },
    { value: 'trending', label: 'Trending Now' },
    { value: 'editors-choice', label: "Editor's Choice" },
    { value: 'limited-time', label: 'Limited Time' },
    { value: 'flash-sale', label: 'Flash Sale' },
  ]

  const sortOptions = [
    { value: 'featured', label: 'Featured First' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'discount', label: 'Highest Discount' },
    { value: 'rating', label: 'Best Rating' },
  ]

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    const params = new URLSearchParams(searchParams.toString())
    if (type === 'all') {
      params.delete('type')
    } else {
      params.set('type', type)
    }
    router.push(`?${params.toString()}`)
  }

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort)
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sort)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      {/* Listing Type Filter */}
      <div className="flex flex-wrap gap-2">
        {listingTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => handleTypeChange(type.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === type.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 ml-auto">
        <label htmlFor="listing-sort" className="text-sm font-medium text-gray-700">
          Sort by:
        </label>
        <select
          id="listing-sort"
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
    </div>
  )
}
