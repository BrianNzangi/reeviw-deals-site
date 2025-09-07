"use client"

import { FC, useState, useRef, useEffect } from "react"
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterest } from "react-icons/fa"
import { ExternalLink, ThumbsUp, Copy } from "lucide-react"
import { Product } from "@/types/product"
import Image from "next/image"


interface ProductCardProps {
  product: Product
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)
  const bargainlyLink = `/deal/${product.id}`
  
  // Handle different data formats from different sources
  const imageUrl = product.mainImageUrl || product.image_url || '/images/placeholder.jpg'
  const productLink = product.link || product.url || product.affiliate_url || '#'
  const productVendor = product.vendor || product.store || product.brand || 'Amazon'
  const productRating = product.rating || 0
  const productPrice = typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price || 'Price not available'

  // Close widget on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setShowShare(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Copy to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + bargainlyLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // reset after 2s
    } catch (err) {
      console.error("Failed to copy link", err)
    }
  }

  return (
    <div className="border border-gray-100 rounded-md p-2 transition-colors relative 
                    w-full md:w-[222.1px] flex flex-row md:flex-col">
      
      <a href={productLink} target="_blank" rel="noopener noreferrer" className="
        flex flex-row md:block flex-1 gap-3 md:gap-0">
        
        {/* Product Image */}
        <div className="w-24 h-20 md:w-full md:h-48 flex-shrink-0 
                        flex items-center justify-center overflow-hidden mb-0 md:mb-3">
          <Image
            src={imageUrl}
            alt={product.title}
            width={200}
            height={200}
            className="object-contain rounded-lg transition-transform duration-200 hover:scale-105 
                       w-full h-full"
          />
        </div>
        
        {/* Content Container */}
        <div className="flex-1 md:block">
          <h3
            className="text-sm font-medium line-clamp-3 mb-2 hover:text-blue-600"
            title={product.title}
          >
            {product.title}
          </h3>
          
          {/* Mobile Pricing + Vendor - Show in content area */}
          <div className="md:hidden">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-[#1F2323]">{productPrice}</span>
              {product.originalPrice && (
                <span className="text-sm text-red-600 line-through">{product.originalPrice}</span>
              )}
            </div>
            <div className="text-xs text-gray-500 italic mb-1">{productVendor}</div>
            
            {/* Ratings for mobile */}
            {productRating > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-700">
                <ThumbsUp className="w-3 h-3" /> {productRating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </a>

      {/* Desktop Pricing + Vendor (hidden on mobile) */}
      <div className="mt-auto hidden md:block">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold text-[#1F2323]">{productPrice}</span>
          {product.originalPrice && (
            <span className="text-sm text-red-600 line-through">{product.originalPrice}</span>
          )}
        </div>
        <div className="text-xs text-gray-500 italic mb-2">{productVendor}</div>

        {/* Ratings + Share - Desktop only */}
        <div className="border-t border-gray-200 pt-2 flex items-center justify-between relative">
          {productRating > 0 ? (
            <span className="flex items-center gap-1 text-xs text-gray-700">
              <ThumbsUp className="w-3 h-3" /> {productRating.toFixed(1)}
            </span>
          ) : (
            <span className="text-xs text-gray-500">No rating</span>
          )}

          {/* Share Toggle */}
          <button
            className="p-1 bg-gray-100 rounded relative z-10"
            onClick={() => setShowShare(!showShare)}
            aria-label="Share this product"
          >
            <ExternalLink className="w-4 h-4 text-gray-500 hover:text-black" />
          </button>

          {/* Share Widget */}
          {showShare && (
            <div
              ref={widgetRef}
              className="absolute right-0 top-full mt-1 bg-white rounded shadow-md flex gap-2 p-2 z-20 border"
            >
              <a
                href={`${bargainlyLink}?share=instagram`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Instagram"
                className="p-1 rounded hover:bg-[#92f7fa]"
              >
                <FaInstagram className="w-5 h-5 text-gray-700" />
              </a>
              <a
                href={`${bargainlyLink}?share=facebook`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="p-1 rounded hover:bg-[#92f7fa]"
              >
                <FaFacebookF className="w-5 h-5 text-gray-700" />
              </a>
              <a
                href={`${bargainlyLink}?share=pinterest`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Pinterest"
                className="p-1 rounded hover:bg-[#92f7fa]"
              >
                <FaPinterest className="w-5 h-5 text-gray-700" />
              </a>
              <a
                href={`${bargainlyLink}?share=twitter`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
                className="p-1 rounded hover:bg-[#92f7fa]"
              >
                <FaTwitter className="w-5 h-5 text-gray-700" />
              </a>

              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                aria-label="Copy product link"
                className="p-1 rounded hover:bg-[#92f7fa] flex items-center gap-1"
              >
                <Copy className="w-5 h-5 text-gray-700" />
                <span className="text-xs">{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard