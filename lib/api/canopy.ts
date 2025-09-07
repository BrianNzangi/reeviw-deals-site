// Canopy API Integration for Amazon Products
// API Key: 017407ea-57f7-42af-9560-a7edee7d9d54
// Store ID: reeviw-20
// Limit: 100 requests per month

const API_KEY = process.env.CANOPY_API_KEY || "017407ea-57f7-42af-9560-a7edee7d9d54";
const STORE_ID = process.env.CANOPY_STORE_ID || "reeviw-20";

if (!API_KEY) {
  throw new Error("❌ CANOPY_API_KEY is not set");
}

if (!STORE_ID) {
  throw new Error("❌ CANOPY_STORE_ID is not set");
}

const headers = {
  "Content-Type": "application/json",
  "API-KEY": API_KEY as string,
  "StoreID": STORE_ID as string,
};

export type CanopyProduct = {
  id: string;
  asin: string;
  title: string;
  mainImageUrl: string;
  rating?: number;
  price: string;
  originalPrice?: string;
  discount?: number;
  vendor?: string;
  description?: string;
  features?: string[];
  category?: string;
  reviewCount?: number;
  lastFetched?: string;
  link: string;
  affiliateUrl: string;
  source: 'amazon';
  createdAt: string;
  updatedAt: string;
};

// Enhanced single product fetch with more data
export async function fetchAmazonProduct(asin: string): Promise<CanopyProduct> {
  const query = `
    query {
      amazonProduct(input: {asin: "${asin}"}) {
        title
        mainImageUrl
        rating
        price { display }
        vendor
        description
        features
        categoryPath
        reviewCount
      }
    }
  `;

  try {
    const res = await fetch("https://graphql.canopyapi.co/", {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    
    if (json.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
    }

    const product = json.data.amazonProduct;
    
    if (!product) {
      throw new Error(`Product not found for ASIN: ${asin}`);
    }

    const now = new Date().toISOString();
    
    return {
      id: asin,
      asin: asin,
      title: product.title,
      mainImageUrl: product.mainImageUrl,
      rating: product.rating,
      price: product.price.display,
      vendor: product.vendor || 'Amazon',
      description: product.description,
      features: product.features || [],
      category: product.categoryPath ? product.categoryPath.split(' > ').pop() : 'general',
      reviewCount: product.reviewCount || 0,
      link: `https://www.amazon.com/dp/${asin}?tag=${STORE_ID}`,
      affiliateUrl: `https://www.amazon.com/dp/${asin}?tag=${STORE_ID}`,
      source: 'amazon',
      createdAt: now,
      updatedAt: now,
      lastFetched: now,
    };
  } catch (error) {
    console.error(`Error fetching product ${asin}:`, error);
    throw error;
  }
}

// Enhanced search with more product data in single request
export async function canopySearchProducts(query: string, limit?: number): Promise<CanopyProduct[]> {
  const searchQuery = `
    query {
      amazonProductSearchResults(input: { searchTerm: "${query}" }) {
        productResults {
          results {
            asin
            title
            mainImageUrl
            rating
            price { display }
            brand
            bookDescription
            featureBullets
            categories {
              name
            }
            reviewsTotal
            url
            isPrime
          }
          pageInfo {
            currentPage
            totalPages
            hasNextPage
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://graphql.canopyapi.co/", {
      method: "POST",
      headers,
      body: JSON.stringify({ query: searchQuery }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    
    if (json.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
    }

    const results = json.data.amazonProductSearchResults.productResults.results;
    const now = new Date().toISOString();

    // Define interface for Amazon product search result
    interface AmazonSearchResult {
      asin: string;
      title: string;
      mainImageUrl: string;
      rating?: number;
      price?: { display: string };
      brand?: string;
      bookDescription?: string;
      featureBullets?: string[];
      categories?: { name: string }[];
      reviewsTotal?: number;
      url?: string;
    }

    // Apply limit if provided
    const limitedResults = limit ? results.slice(0, limit) : results;
    
    return limitedResults.map((product: AmazonSearchResult) => ({
      id: product.asin,
      asin: product.asin,
      title: product.title,
      mainImageUrl: product.mainImageUrl,
      rating: product.rating,
      price: product.price ? product.price.display : '0',
      vendor: product.brand || 'Amazon',
      description: product.bookDescription || product.featureBullets?.join(' ') || null,
      features: product.featureBullets || [],
      category: product.categories && product.categories.length > 0 ? product.categories[product.categories.length - 1].name : 'general',
      reviewCount: product.reviewsTotal || 0,
      link: product.url || `https://www.amazon.com/dp/${product.asin}?tag=${STORE_ID}`,
      affiliateUrl: product.url || `https://www.amazon.com/dp/${product.asin}?tag=${STORE_ID}`,
      source: 'amazon' as const,
      createdAt: now,
      updatedAt: now,
      lastFetched: now,
    }));
  } catch (error) {
    console.error(`Error searching products for "${query}":`, error);
    throw error;
  }
}

// Bulk fetch multiple ASINs efficiently (single request)
export async function fetchMultipleAmazonProducts(asins: string[]): Promise<CanopyProduct[]> {
  if (asins.length === 0) return [];
  
  // Limit to reasonable batch size
  const batchAsins = asins.slice(0, 10);
  
  const queries = batchAsins.map((asin, index) => `
    product${index}: amazonProduct(input: {asin: "${asin}"}) {
      title
      mainImageUrl
      rating
      price { display }
      vendor
      description
      features
      categoryPath
      reviewCount
    }
  `).join('\n');

  const query = `
    query {
      ${queries}
    }
  `;

  try {
    const res = await fetch("https://graphql.canopyapi.co/", {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    
    if (json.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
    }

    const now = new Date().toISOString();
    const products: CanopyProduct[] = [];

    batchAsins.forEach((asin, index) => {
      const product = json.data[`product${index}`];
      if (product) {
        products.push({
          id: asin,
          asin: asin,
          title: product.title,
          mainImageUrl: product.mainImageUrl,
          rating: product.rating,
          price: product.price.display,
          vendor: product.vendor || 'Amazon',
          description: product.description,
          features: product.features || [],
          category: product.categoryPath ? product.categoryPath.split(' > ').pop() : 'general',
          reviewCount: product.reviewCount || 0,
          link: `https://www.amazon.com/dp/${asin}?tag=${STORE_ID}`,
          affiliateUrl: `https://www.amazon.com/dp/${asin}?tag=${STORE_ID}`,
          source: 'amazon',
          createdAt: now,
          updatedAt: now,
          lastFetched: now,
        });
      }
    });

    return products;
  } catch (error) {
    console.error(`Error fetching multiple products:`, error);
    throw error;
  }
}

// Get curated product lists by category to maximize API efficiency
export async function getCanopyProductsByCategory(category: string, limit?: number): Promise<CanopyProduct[]> {
  const categoryQueries: { [key: string]: string } = {
    'electronics': 'electronics gadgets tech devices',
    'home-garden': 'home kitchen garden tools furniture',
    'fashion': 'clothing shoes fashion apparel accessories',
    'health-beauty': 'health beauty skincare cosmetics supplements',
    'sports-outdoors': 'sports fitness outdoor camping exercise',
    'books-media': 'books kindle audiobooks media entertainment',
    'toys-games': 'toys games kids children educational',
    'automotive': 'automotive car parts accessories tools',
  };

  const searchQuery = categoryQueries[category] || category;
  const products = await canopySearchProducts(searchQuery);
  return limit ? products.slice(0, limit) : products;
}

// API usage tracking and optimization
let requestCount = 0;
const MAX_REQUESTS = 100;

export function getApiUsage(): { used: number; remaining: number; limit: number } {
  return {
    used: requestCount,
    remaining: MAX_REQUESTS - requestCount,
    limit: MAX_REQUESTS
  };
}

export function incrementApiUsage(): void {
  requestCount++;
  if (requestCount >= MAX_REQUESTS) {
    console.warn('⚠️ Canopy API monthly limit reached!');
  }
}
