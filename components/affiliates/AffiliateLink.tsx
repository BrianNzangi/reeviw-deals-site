'use client'

import { trackAffiliateClick } from '@/lib/api/affiliateApi'

interface AffiliateLinkProps {
  href: string
  productId: string
  children: React.ReactNode
  className?: string
  source?: string
  onClick?: () => void
}

export default function AffiliateLink({
  href,
  productId,
  children,
  className = '',
  source,
  onClick
}: AffiliateLinkProps) {
  const handleClick = async () => {
    // Track the click
    try {
      await trackAffiliateClick({
        productId,
        source: source || 'unknown',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to track affiliate click:', error)
    }

    // Call custom onClick if provided
    if (onClick) {
      onClick()
    }

    // Let the default link behavior continue
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      {children}
    </a>
  )
}
