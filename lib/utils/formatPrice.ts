export function formatPrice(price: number, currency: string = 'USD'): string {
  if (typeof price !== 'number' || isNaN(price)) {
    return '$0.00'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export function formatPriceRange(min: number, max: number, currency: string = 'USD'): string {
  return `${formatPrice(min, currency)} - ${formatPrice(max, currency)}`
}

export function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0 || salePrice < 0 || salePrice > originalPrice) {
    return 0
  }
  
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

export function formatDiscountPercentage(originalPrice: number, salePrice: number): string {
  const discount = calculateDiscountPercentage(originalPrice, salePrice)
  return discount > 0 ? `${discount}% OFF` : ''
}

export function calculateSavings(originalPrice: number, salePrice: number, currency: string = 'USD'): string {
  const savings = originalPrice - salePrice
  return savings > 0 ? formatPrice(savings, currency) : formatPrice(0, currency)
}

// Utility to parse price strings back to numbers
export function parsePrice(priceString: string): number {
  // Remove currency symbols and whitespace
  const cleaned = priceString.replace(/[$,\s]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

// Format price for display in different contexts
export function formatPriceCompact(price: number): string {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`
  }
  if (price >= 1000) {
    return `$${(price / 1000).toFixed(1)}K`
  }
  return formatPrice(price)
}

export function formatPriceWithCommas(price: number): string {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
