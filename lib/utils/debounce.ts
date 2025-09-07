export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Specialized debounce for search functionality
export function debounceSearch(
  searchFunction: (query: string) => void,
  delay: number = 300
) {
  return debounce((query: unknown) => searchFunction(query as string), delay)
}

// Debounce for API calls with loading state
export function debounceAsync<T extends unknown[], R>(
  asyncFunction: (...args: T) => Promise<R>,
  delay: number,
  onStart?: () => void,
  onComplete?: () => void
) {
  let timeoutId: NodeJS.Timeout | null = null
  
  return (...args: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(async () => {
        try {
          onStart?.()
          const result = await asyncFunction(...args)
          resolve(result)
        } catch (error) {
          reject(error)
        } finally {
          onComplete?.()
        }
      }, delay)
    })
  }
}

// Throttle function as an alternative to debounce
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
