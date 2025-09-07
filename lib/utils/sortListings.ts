import type { Product } from '@/types/product'
import type { Listing } from '@/types/listing'

export type SortOption = 
  | 'relevance' 
  | 'price-low' 
  | 'price-high' 
  | 'discount' 
  | 'newest' 
  | 'rating'
  | 'featured'

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sortedProducts = [...products]

  switch (sortBy) {
    case 'price-low':
      return sortedProducts.sort((a, b) => Number(a.price) - Number(b.price))
    
    case 'price-high':
      return sortedProducts.sort((a, b) => Number(b.price) - Number(a.price))
    
    case 'discount':
      return sortedProducts.sort((a, b) => {
        const aDiscount = a.discount || 0
        const bDiscount = b.discount || 0
        return bDiscount - aDiscount
      })
    
    case 'newest':
      return sortedProducts.sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 
                     a.updatedAt ? new Date(a.updatedAt).getTime() : 0
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 
                     b.updatedAt ? new Date(b.updatedAt).getTime() : 0
        return bDate - aDate
      })
    
    case 'rating':
      return sortedProducts.sort((a, b) => {
        const aRating = a.rating || 0
        const bRating = b.rating || 0
        if (aRating === bRating) {
          // Secondary sort by review count
          const aReviews = a.reviewCount || 0
          const bReviews = b.reviewCount || 0
          return bReviews - aReviews
        }
        return bRating - aRating
      })
    
    case 'relevance':
    default:
      // Default sort by a combination of factors
      return sortedProducts.sort((a, b) => {
        // Calculate relevance score
        const aScore = calculateRelevanceScore(a)
        const bScore = calculateRelevanceScore(b)
        return bScore - aScore
      })
  }
}

export function sortListings(listings: Listing[], sortBy: SortOption): Listing[] {
  const sortedListings = [...listings]

  switch (sortBy) {
    case 'featured':
      return sortedListings.sort((a, b) => {
        // Featured items first
        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        
        // Then by featured order
        const aOrder = a.featuredOrder || 999
        const bOrder = b.featuredOrder || 999
        return aOrder - bOrder
      })
    
    case 'newest':
      return sortedListings.sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime()
        const bDate = new Date(b.createdAt).getTime()
        return bDate - aDate
      })
    
    default:
      // For other sort options, sort by the associated product
      if (sortedListings.every(listing => listing.product)) {
        const products = sortedListings.map(listing => listing.product!)
        const sortedProducts = sortProducts(products, sortBy)
        
        // Rearrange listings based on sorted products
        return sortedProducts.map(product => 
          sortedListings.find(listing => listing.product?.id === product.id)!
        ).filter(Boolean)
      }
      
      return sortedListings
  }
}

// Calculate relevance score based on multiple factors
function calculateRelevanceScore(product: Product): number {
  let score = 0
  
  // Discount weight (0-40 points)
  const discount = product.discount || 0
  score += Math.min(discount * 0.8, 40)
  
  // Rating weight (0-25 points)
  const rating = product.rating || 0
  score += (rating / 5) * 25
  
  // Review count weight (0-20 points)
  const reviewCount = product.reviewCount || 0
  score += Math.min(Math.log10(reviewCount + 1) * 8, 20)
  
  // Price weight (0-15 points) - lower prices get higher scores
  const price = product.price
  if (Number(price) <= 25) score += 15
  else if (Number(price) <= 50) score += 12
  else if (Number(price) <= 100) score += 8
  else if (Number(price) <= 200) score += 4
  
  // Recency weight (0-10 points)
  const updatedAt = new Date(product.updatedAt ?? product.createdAt ?? new Date())
  const daysSinceUpdate = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24)
  if (daysSinceUpdate <= 1) score += 10
  else if (daysSinceUpdate <= 7) score += 7
  else if (daysSinceUpdate <= 30) score += 3
  
  return score
}

// Filter functions
export function filterProductsByPrice(
  products: Product[], 
  minPrice?: number, 
  maxPrice?: number
): Product[] {
  return products.filter(product => {
    if (minPrice !== undefined && Number(product.price) < minPrice) return false
    if (maxPrice !== undefined && Number(product.price) > maxPrice) return false
    return true
  })
}

export function filterProductsByDiscount(
  products: Product[], 
  minDiscount?: number
): Product[] {
  if (!minDiscount) return products
  
  return products.filter(product => {
    const discount = product.discount || 0
    return discount >= minDiscount
  })
}

export function filterProductsByCategory(
  products: Product[], 
  category?: string
): Product[] {
  if (!category) return products
  
  return products.filter(product => 
    product.category?.toLowerCase() === category.toLowerCase()
  )
}

export function filterProductsBySource(
  products: Product[], 
  sources?: string[]
): Product[] {
  if (!sources || sources.length === 0) return products
  
  return products.filter(product => 
    sources.includes(product.source?.toLowerCase() ?? '')
  )
}

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products
  
  const searchTerm = query.toLowerCase().trim()
  
  return products.filter(product => {
    const titleMatch = product.title.toLowerCase().includes(searchTerm)
    const descriptionMatch = product.description?.toLowerCase().includes(searchTerm)
    const categoryMatch = product.category?.toLowerCase().includes(searchTerm) ?? false
    const featuresMatch = product.features?.some(feature => 
      feature.toLowerCase().includes(searchTerm)
    )
    
    return titleMatch || descriptionMatch || categoryMatch || featuresMatch
  })
}
