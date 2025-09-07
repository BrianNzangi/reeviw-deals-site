import { notFound } from "next/navigation"
import Image from "next/image"
import { getProductById, getRelatedProducts } from "@/lib/api/affiliateApi"
import AffiliateLink from "@/components/affiliates/AffiliateLink"
import ProductCard from "@/components/products/ProductCard"
import { formatPrice } from "@/lib/utils/formatPrice"

interface ProductPageProps {
  params: {
    productId: string
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductById(params.productId)
  
  if (!product) {
    return {
      title: "Product Not Found - Bargainly"
    }
  }

  return {
    title: `${product.title} - Bargainly`,
    description: product.description || `Find the best deal on ${product.title}`,
    openGraph: {
      images: [product.imageUrl],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = params
  
  const product = await getProductById(productId)
  
  if (!product) {
    notFound()
  }
  
  // Get related products
  const relatedProducts = await getRelatedProducts(productId, product.category)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl ?? ""}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        
        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-green-600">
                {formatPrice(Number(product.price))}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(Number(product.originalPrice))}
                </span>
              )}
              {product.discount && (
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                  {product.discount}% OFF
                </span>
              )}
            </div>
          </div>
          
          {product.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}
          
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Affiliate Link */}
          <div className="pt-4">
            <AffiliateLink
              href={product.affiliateUrl ?? ""}
              productId={product.id}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-center text-lg transition-colors"
            >
              Get This Deal on {product.source}
            </AffiliateLink>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Price and availability may vary. Last updated: {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
