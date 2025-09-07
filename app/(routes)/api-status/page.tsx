"use client"

import { useState, useEffect } from "react"
import { canopySearchProducts, getApiUsage, fetchAmazonProduct } from "@/lib/api/canopy"
import type { CanopyProduct } from "@/lib/api/canopy"
import Image from "next/image"


export default function ApiStatusPage() {
  const [usage, setUsage] = useState({ used: 0, remaining: 100, limit: 100 })
  const [testResult, setTestResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<CanopyProduct[]>([])

  useEffect(() => {
    setUsage(getApiUsage())
  }, [])

  const testCanopySearch = async () => {
    setIsLoading(true)
    setTestResult("")
    
    try {
      const results = await canopySearchProducts("wireless headphones")
      setProducts(results)
      setTestResult(`✅ Success! Found ${results.length} products`)
      setUsage(getApiUsage())
    } catch (error: unknown) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testSingleProduct = async () => {
    setIsLoading(true)
    setTestResult("")
    
    try {
      const product = await fetchAmazonProduct("B09JQMJHXY")
      setProducts([product])
      setUsage(getApiUsage())
    } catch (error: unknown) {
      console.error(error)
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Canopy API Status</h1>
        
        {/* API Usage Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">API Usage</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{usage.used}</div>
              <div className="text-sm text-gray-600">Used</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{usage.remaining}</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{usage.limit}</div>
              <div className="text-sm text-gray-600">Monthly Limit</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round((usage.used / usage.limit) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  usage.used / usage.limit > 0.8 ? 'bg-red-600' : 
                  usage.used / usage.limit > 0.6 ? 'bg-yellow-600' : 'bg-green-600'
                }`}
                style={{ width: `${(usage.used / usage.limit) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test API</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={testCanopySearch}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Testing..." : "Test Search (5 products)"}
              </button>
              <button
                onClick={testSingleProduct}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? "Testing..." : "Test Single Product"}
              </button>
            </div>
            
            {testResult && (
              <div className={`p-3 rounded-lg ${
                testResult.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {testResult}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {products.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Results ({products.length})</h2>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex gap-4">
                    <Image
                      src={product.mainImageUrl}
                      alt={product.title}
                      className="w-20 h-20 object-contain rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-2">{product.title}</h3>
                      <p className="text-green-600 font-bold">{product.price}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>⭐ {product.rating || 'N/A'}</span>
                        <span>📝 {product.reviewCount || 0} reviews</span>
                        <span>🏪 {product.vendor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configuration Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="space-y-2 text-sm">
            <div><strong>API Key:</strong> 017407ea-57f7-42af-9560-a7edee7d9d54</div>
            <div><strong>Store ID:</strong> reeviw-20</div>
            <div><strong>Monthly Limit:</strong> 100 requests</div>
            <div><strong>Endpoint:</strong> https://graphql.canopyapi.co/</div>
          </div>
        </div>
      </div>
    </div>
  )
}
