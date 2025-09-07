import Redis from 'ioredis'
import { REDIS_CONFIG } from './constants'
import type { Product } from '@/types/product'

// Redis client instance
let redis: Redis | null = null

// Create Redis connection
export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis(REDIS_CONFIG.url, {
      tls: REDIS_CONFIG.tls ? {} : undefined,
      maxRetriesPerRequest: REDIS_CONFIG.maxRetries,
      enableReadyCheck: true,
      lazyConnect: true,
      connectTimeout: 10000,
      commandTimeout: 5000
    })

    redis.on('error', (error) => {
      console.error('Redis connection error:', error)
    })

    redis.on('connect', () => {
      console.log('Connected to Redis')
    })

    redis.on('ready', () => {
      console.log('Redis is ready')
    })
  }

  return redis
}

// Cache utilities
export class RedisCache {
  private client: Redis
  
  constructor() {
    this.client = getRedisClient()
  }

  // Generic get method with JSON parsing
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key)
      if (!value) return null
      return JSON.parse(value) as T
    } catch (error) {
      console.error(`Redis GET error for key ${key}:`, error)
      return null
    }
  }

  // Generic set method with JSON serialization
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value)
      const actualTTL = ttl || REDIS_CONFIG.defaultTTL
      
      if (actualTTL > 0) {
        await this.client.setex(key, actualTTL, serialized)
      } else {
        await this.client.set(key, serialized)
      }
      
      return true
    } catch (error) {
      console.error(`Redis SET error for key ${key}:`, error)
      return false
    }
  }

  // Delete a key
  async del(key: string): Promise<boolean> {
    try {
      await this.client.del(key)
      return true
    } catch (error) {
      console.error(`Redis DEL error for key ${key}:`, error)
      return false
    }
  }

  // Delete keys by pattern
  async delPattern(pattern: string): Promise<number> {
    try {
      const keys = await this.client.keys(pattern)
      if (keys.length === 0) return 0
      
      await this.client.del(...keys)
      return keys.length
    } catch (error) {
      console.error(`Redis DEL pattern error for pattern ${pattern}:`, error)
      return 0
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key)
      return result === 1
    } catch (error) {
      console.error(`Redis EXISTS error for key ${key}:`, error)
      return false
    }
  }

  // Set expiration for existing key
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      const result = await this.client.expire(key, ttl)
      return result === 1
    } catch (error) {
      console.error(`Redis EXPIRE error for key ${key}:`, error)
      return false
    }
  }

  // Get TTL for a key
  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key)
    } catch (error) {
      console.error(`Redis TTL error for key ${key}:`, error)
      return -1
    }
  }

  // Increment a numeric value
  async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key)
    } catch (error) {
      console.error(`Redis INCR error for key ${key}:`, error)
      return 0
    }
  }

  // Add item to a set
  async sadd(key: string, ...members: string[]): Promise<number> {
    try {
      return await this.client.sadd(key, ...members)
    } catch (error) {
      console.error(`Redis SADD error for key ${key}:`, error)
      return 0
    }
  }

  // Get all members of a set
  async smembers(key: string): Promise<string[]> {
    try {
      return await this.client.smembers(key)
    } catch (error) {
      console.error(`Redis SMEMBERS error for key ${key}:`, error)
      return []
    }
  }

  // Check if member exists in set
  async sismember(key: string, member: string): Promise<boolean> {
    try {
      const result = await this.client.sismember(key, member)
      return result === 1
    } catch (error) {
      console.error(`Redis SISMEMBER error for key ${key}:`, error)
      return false
    }
  }

  // Push item to list (left)
  async lpush(key: string, ...values: string[]): Promise<number> {
    try {
      return await this.client.lpush(key, ...values)
    } catch (error) {
      console.error(`Redis LPUSH error for key ${key}:`, error)
      return 0
    }
  }

  // Get range from list
  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    try {
      return await this.client.lrange(key, start, stop)
    } catch (error) {
      console.error(`Redis LRANGE error for key ${key}:`, error)
      return []
    }
  }
}

// Export a default cache instance
export const cache = new RedisCache()

// Utility functions for common cache patterns
export const CacheUtils = {
  // Generate cache keys
  generateKey: (prefix: keyof typeof REDIS_CONFIG.cacheKeys, ...parts: string[]) => {
    return REDIS_CONFIG.cacheKeys[prefix] + parts.join(':')
  },

  // Cache with fallback
  async getOrSet<T>(
    key: string,
    fallback: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await cache.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const fresh = await fallback()
    await cache.set(key, fresh, ttl)
    return fresh
  },

  // Cache products
  async cacheProducts(products: Product[], category?: string, page: number = 1) {
    const key = this.generateKey('products', category || 'all', page.toString())
    return cache.set(key, products, 60 * 30) // 30 minutes
  },

  // Get cached products
  async getCachedProducts(category?: string, page: number = 1) {
    const key = this.generateKey('products', category || 'all', page.toString())
    return cache.get<Product[]>(key)
  },

  // Cache search results
  async cacheSearchResults(query: string, results: Product[], page: number = 1) {
    const key = this.generateKey('search', query.toLowerCase(), page.toString())
    return cache.set(key, results, 60 * 15) // 15 minutes
  },

  // Get cached search results
  async getCachedSearchResults(query: string, page: number = 1) {
    const key = this.generateKey('search', query.toLowerCase(), page.toString())
    return cache.get<Product[]>(key)
  },

  // Invalidate cache patterns
  async invalidateProducts(category?: string) {
    const pattern = category 
      ? this.generateKey('products', category, '*')
      : this.generateKey('products', '*')
    return cache.delPattern(pattern)
  },

  async invalidateSearchResults() {
    const pattern = this.generateKey('search', '*')
    return cache.delPattern(pattern)
  }
}
