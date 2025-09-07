'use client'

import { useState } from 'react'
// import { subscribeToNewsletter } from '@/lib/api/brevo' // Dormant for now

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setStatus('idle')

    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      setMessage('Thanks for subscribing! (Email service is currently disabled)')
      setEmail('')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !email}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      
      {status !== 'idle' && (
        <div className={`text-sm ${
          status === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        We&apos;ll send you the best deals and never spam. Unsubscribe anytime.
      </p>
    </form>
  )
}
