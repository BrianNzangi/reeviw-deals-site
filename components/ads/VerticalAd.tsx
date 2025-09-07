"use client"

import { FC } from "react"
import Image from "next/image"
import StickyAd from "./StickyAd"

interface VerticalAdProps {
  className?: string
}

const VerticalAd: FC<VerticalAdProps> = ({ className = "" }) => {
  // Create array of ad configurations
  const adConfigs = [
    // First 2 ads: 300x250
    { id: 1, width: 300, height: 250 },
    { id: 2, width: 300, height: 250 },
    // Next 5 ads: 300x600
    { id: 3, width: 300, height: 600 },
    { id: 4, width: 300, height: 600 },
    { id: 5, width: 300, height: 600 },
    { id: 6, width: 300, height: 600 },
    { id: 7, width: 300, height: 600, isSticky: true },
  ]

  const AdComponent = ({ config }: { config: typeof adConfigs[0] }) => {
    const adContent = (
      <div className="relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden">
        <div className="p-2">
          <span className="absolute top-2 left-3 text-xs text-gray-500 font-medium z-10 bg-white/80 px-1 rounded">
            Advertisement
          </span>
          <div className="mt-4">
            <Image
              src={`/${config.id}.jpg`}
              alt={`Advertisement ${config.id}`}
              width={config.width}
              height={config.height}
              className="w-full h-auto rounded-md object-cover"
              style={{ aspectRatio: `${config.width}/${config.height}` }}
            />
          </div>
        </div>
      </div>
    )
    
    if (config.isSticky) {
      return (
        <StickyAd stickyOffset={32}>
          {adContent}
        </StickyAd>
      )
    }
    
    return (
      <div>
        {adContent}
      </div>
    )
  }

  return (
    <div className={`w-[300px] flex flex-col gap-6 ${className}`}>
      {adConfigs.map((config) => (
        <AdComponent key={config.id} config={config} />
      ))}
    </div>
  )
}

export default VerticalAd
