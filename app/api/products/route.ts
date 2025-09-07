import { NextRequest, NextResponse } from 'next/server'
import { supabase, trackSearchAnalytics } from '@/lib/api/supabase'
import { CacheUtils } from '@/lib/redis'
import { PAGINATION_CONFIG, CATEGORIES } from '@/lib/constants'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const store = searchParams.get('store')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minDiscount = searchParams.get('minDiscount')
    const sort = searchParams.get('sort') || 'created_at'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || PAGINATION_CONFIG.productsPerPage.toString())
    const featured = searchParams.get('featured') === 'true'
    const trending = searchParams.get('trending') === 'true'

    // Generate cache key
    const cacheKey = CacheUtils.generateKey(
      'products',
      [
        category || 'all',
        search || '',
        store || '',
        minPrice || '',
        maxPrice || '',
        minDiscount || '',
        sort,
        page.toString(),
        limit.toString(),
        featured.toString(),
        trending.toString()
      ].join('|')
    )

    // Try to get from cache first
    const cachedProducts = await CacheUtils.getCachedProducts(cacheKey)
    if (cachedProducts) {
      return NextResponse.json({
        products: cachedProducts,
        pagination: {
          page,
          limit,
          hasMore: cachedProducts.length === limit
        },
        cached: true
      })
    }

    // Build Supabase query
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })

    // Apply filters
    if (category && category !== 'all') {
      const validCategory = CATEGORIES.find(cat => cat.id === category)
      if (validCategory) {
        query = query.eq('category', category)
      }
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`)
    }

    if (store) {
      query = query.eq('store', store)
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }

    if (minDiscount) {
      query = query.gte('discount_percentage', parseInt(minDiscount))
    }

    if (featured) {
      query = query.eq('is_featured', true)
    }

    if (trending) {
      query = query.eq('is_trending', true)
    }

    // Apply sorting
    switch (sort) {
      case 'price-low':
        query = query.order('price', { ascending: true })
        break
      case 'price-high':
        query = query.order('price', { ascending: false })
        break
      case 'discount':
        query = query.order('discount_percentage', { ascending: false })
        break
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      case 'newest':
      case 'created_at':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    // Execute query
    const { data: products, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    // Cache the results
    await CacheUtils.cacheProducts(products || [], cacheKey)

    // Track search analytics if there's a search query
    if (search) {
      try {
        await trackSearchAnalytics(
          search,
          count || 0,
          undefined, // userId - could be extracted from auth if needed
          request.headers.get('x-forwarded-for') || undefined
        )
      } catch (analyticsError) {
        console.error('Failed to track search analytics:', analyticsError)
        // Don't fail the request if analytics tracking fails
      }
    }

    return NextResponse.json({
      products: products || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: (count || 0) > offset + limit
      },
      cached: false
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { title, price, affiliate_url, store, category } = body
    
    if (!title || !price || !affiliate_url || !store || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert product into Supabase
    const { data: product, error } = await supabase
      .from('products')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      )
    }

    // Invalidate related caches
    await CacheUtils.invalidateProducts(category)
    await CacheUtils.invalidateProducts() // invalidate 'all' products cache

    return NextResponse.json({
      product,
      message: 'Product created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
