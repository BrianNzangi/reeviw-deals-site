import { createClient } from '@supabase/supabase-js'
import type { Category } from '@/types/category'
import type { Listing } from '@/types/listing'
import { SUPABASE_CONFIG } from '@/lib/constants'
import type { UserProfile } from './types'

// Initialize Supabase client
export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
)

// Admin client with elevated permissions (server-side only)
export const supabaseAdmin = SUPABASE_CONFIG.serviceRoleKey 
  ? createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : null

// Types for database entities
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          original_price: number | null
          discount_percentage: number | null
          image_url: string | null
          affiliate_url: string
          store: string
          category: string
          brand: string | null
          rating: number | null
          reviews_count: number | null
          is_featured: boolean
          is_trending: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          original_price?: number | null
          discount_percentage?: number | null
          image_url?: string | null
          affiliate_url: string
          store: string
          category: string
          brand?: string | null
          rating?: number | null
          reviews_count?: number | null
          is_featured?: boolean
          is_trending?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          original_price?: number | null
          discount_percentage?: number | null
          image_url?: string | null
          affiliate_url?: string
          store?: string
          category?: string
          brand?: string | null
          rating?: number | null
          reviews_count?: number | null
          is_featured?: boolean
          is_trending?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          subscribed_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          subscribed_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          subscribed_at?: string
          is_active?: boolean
        }
      }
    }
  }
}

// Categories
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  } catch (error: unknown) {
    console.error('Error in getCategories:', error instanceof Error ? error.message : String(error))
    return []
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching category:', error)
      return null
    }

    return data
  } catch (error: unknown) {
    console.error('Error in getCategoryById:', error instanceof Error ? error.message : String(error))
    return null
  }
}

// Curated Listings
export async function getCuratedListings(): Promise<Listing[]> {
  try {
    const { data, error } = await supabase
      .from('curated_listings')
      .select(`
        *,
        product:products(*)
      `)
      .eq('is_active', true)
      .order('featured_order', { ascending: true })

    if (error) {
      console.error('Error fetching curated listings:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getCuratedListings:', error)
    return []
  }
}

export async function getFeaturedListings(): Promise<Listing[]> {
  try {
    const { data, error } = await supabase
      .from('curated_listings')
      .select(`
        *,
        product:products(*)
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('featured_order', { ascending: true })
      .limit(6)

    if (error) {
      console.error('Error fetching featured listings:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getFeaturedListings:', error)
    return []
  }
}

// User Management
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return null
  }
}

export async function createUserProfile(userId: string, profile: UserProfile) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        ...profile,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user profile:', error)
      throw error
    }

    return data
  } catch (error: unknown) {
    console.error('Error in createUserProfile:', error instanceof Error ? error.message : String(error))
    throw error
  }
}

// Favorites/Wishlist
export async function getUserFavorites(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user favorites:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserFavorites:', error)
    return []
  }
}

export async function addToFavorites(userId: string, productId: string) {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        product_id: productId,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding to favorites:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in addToFavorites:', error)
    throw error
  }
}

export async function removeFromFavorites(userId: string, productId: string) {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) {
      console.error('Error removing from favorites:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in removeFromFavorites:', error)
    throw error
  }
}

// Analytics
export async function trackPageView(page: string, userId?: string) {
  try {
    await supabase
      .from('page_views')
      .insert({
        page,
        user_id: userId,
        timestamp: new Date().toISOString(),
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null
      })
  } catch (error: unknown) {
    console.error('Error tracking page view:', error instanceof Error ? error.message : String(error))
  }
}

export async function trackProductView(productId: string, userId?: string) {
  try {
    await supabase
      .from('product_views')
      .insert({
        product_id: productId,
        user_id: userId,
        timestamp: new Date().toISOString()
      })
  } catch (error: unknown) {
    console.error('Error tracking product view:', error instanceof Error ? error.message : String(error))
  }
}

export async function trackSearchAnalytics(query: string, resultsCount: number, userId?: string, ipAddress?: string) {
  try {
    await supabase
      .from('search_analytics')
      .insert({
        query,
        results_count: resultsCount,
        user_id: userId,
        ip_address: ipAddress,
        searched_at: new Date().toISOString()
      })
  } catch (error: unknown) {
    console.error('Error tracking search analytics:', error instanceof Error ? error.message : String(error))
  }
}

export async function trackAffiliateClick(productId: string, userId?: string, ipAddress?: string, userAgent?: string, referrer?: string) {
  try {
    await supabase
      .from('click_tracking')
      .insert({
        product_id: productId,
        user_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer,
        clicked_at: new Date().toISOString()
      })
  } catch (error: unknown) {
    console.error('Error tracking affiliate click:', error instanceof Error ? error.message : String(error))
  }
}

// Newsletter Functions
export async function subscribeToNewsletter(email: string) {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        subscribed_at: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single()

    if (error) {
      // If it's a unique constraint violation, the email is already subscribed
      if (error.code === '23505') {
        return { success: true, message: 'Email already subscribed', alreadySubscribed: true }
      }
      throw error
    }

    return { success: true, data, message: 'Successfully subscribed!' }
  } catch (error: unknown) {
    console.error('Error subscribing to newsletter:', error instanceof Error ? error.message : String(error))
    return { success: false, message: 'Failed to subscribe' }
  }
}

export async function unsubscribeFromNewsletter(email: string) {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: false })
      .eq('email', email)

    if (error) {
      throw error
    }

    return { success: true, message: 'Successfully unsubscribed!' }
  } catch (error: unknown) {
    console.error('Error unsubscribing from newsletter:', error instanceof Error ? error.message : String(error))
    return { success: false, message: 'Failed to unsubscribe' }
  }
}
