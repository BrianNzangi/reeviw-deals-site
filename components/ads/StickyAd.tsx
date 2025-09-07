"use client"

import { FC, useState, useEffect, useRef } from "react"

interface StickyAdProps {
  children: React.ReactNode
  className?: string
  stickyOffset?: number // Distance from top when sticky (default: 32px = top-8)
  footerSelector?: string // CSS selector for footer element (default: 'footer')
}

const StickyAd: FC<StickyAdProps> = ({ 
  children, 
  className = "", 
  stickyOffset = 32,
  footerSelector = 'footer'
}) => {
  const [isSticky, setIsSticky] = useState(false)
  const [originalTop, setOriginalTop] = useState(0)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [stickyStyle, setStickyStyle] = useState<React.CSSProperties>({})
  
  const adRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get the original position of the ad when component mounts
    const updateOriginalPosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const scrollY = window.scrollY || document.documentElement.scrollTop
        setOriginalTop(rect.top + scrollY)
      }
    }

    // Set initial position
    updateOriginalPosition()

    // Update position and sticky style on resize
    const handleResize = () => {
      updateOriginalPosition()
      if (isSticky && containerRef.current) {
        updateStickyStyle()
      }
    }
    
    const updateStickyStyle = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setStickyStyle({
          top: `${stickyOffset}px`,
          left: `${rect.left}px`,
          width: `${containerRef.current.offsetWidth}px`,
        })
      }
    }

    window.addEventListener('resize', handleResize)
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop
      
      // Determine scroll direction
      const direction = currentScrollY > lastScrollY ? 'down' : 'up'
      setLastScrollY(currentScrollY)

      if (!containerRef.current || !adRef.current) return

      // Get footer position
      const footerElement = document.querySelector(footerSelector)
      let footerTop = Number.POSITIVE_INFINITY
      
      if (footerElement) {
        const footerRect = footerElement.getBoundingClientRect()
        footerTop = footerRect.top + currentScrollY
      }

      // Calculate when the ad should become sticky
      const adShouldBeSticky = currentScrollY > (originalTop - stickyOffset)
      
      // Check if sticky ad would collide with footer
      const adHeight = adRef.current.offsetHeight
      const stickyAdBottom = currentScrollY + stickyOffset + adHeight
      const wouldCollideWithFooter = stickyAdBottom >= footerTop

      if (direction === 'down') {
        // Scrolling down: make sticky when we pass the original position, but not if it would collide with footer
        if (adShouldBeSticky && !isSticky && !wouldCollideWithFooter) {
          setIsSticky(true)
          updateStickyStyle()
        }
        // If sticky and would collide with footer, remove stickiness
        if (isSticky && wouldCollideWithFooter) {
          setIsSticky(false)
        }
      } else {
        // Scrolling up: remove sticky when we reach the original position
        if (currentScrollY <= (originalTop - stickyOffset) && isSticky) {
          setIsSticky(false)
        }
        // Scrolling up: re-enable sticky if we're away from footer and should be sticky
        if (!isSticky && adShouldBeSticky && !wouldCollideWithFooter) {
          setIsSticky(true)
          updateStickyStyle()
        }
      }
      
      // Update sticky position on scroll if already sticky and not colliding
      if (isSticky && !wouldCollideWithFooter) {
        updateStickyStyle()
      } else if (isSticky && wouldCollideWithFooter) {
        // Remove stickiness when colliding with footer
        setIsSticky(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [originalTop, stickyOffset, isSticky, lastScrollY, footerSelector])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        ref={adRef}
        className={`transition-all duration-200 ease-in-out ${
          isSticky
            ? `fixed z-50`
            : 'relative'
        }`}
        style={isSticky ? stickyStyle : {}}
      >
        {children}
      </div>
    </div>
  )
}

export default StickyAd
