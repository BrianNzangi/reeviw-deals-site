"use client"

import { FC } from "react"

interface Ad {
  id: string
  link: string
}

interface VerticalAdsProps {
  ads: Ad[]
}

const VerticalAds: FC<VerticalAdsProps> = ({ ads }) => {
  if (!ads?.length) return null

  const topAds = ads.slice(0, 2)
  const middleAds = ads.slice(2, 8)
  const stickyAd = ads[8]

  const AdBox: FC<{ link: string; square?: boolean }> = ({ link, square }) => (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex items-start justify-center rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
      style={{
        width: "300px",
        height: square ? "250px" : "600px",
      }}
    >
      {/* Label at top */}
      <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] font-medium text-gray-500 bg-white px-2 py-0.5 rounded shadow-sm">
        Advertisement
      </span>

      {/* Inner dashed placeholder fits neatly inside */}
      <div className="mt-8 flex w-[calc(100%-2rem)] h-[calc(100%-3rem)] items-center justify-center rounded-md border border-dashed border-gray-300/70 bg-gray-50/50">
        <span className="text-gray-400 text-sm tracking-wide">Ad Space</span>
      </div>
    </a>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* First 2 ads → squares */}
      <div className="flex flex-col gap-6">
        {topAds.map((ad) => (
          <AdBox key={ad.id} link={ad.link} square />
        ))}
      </div>

      {/* Next 6 ads → rectangles */}
      <div className="flex flex-col gap-6">
        {middleAds.map((ad) => (
          <AdBox key={ad.id} link={ad.link} />
        ))}
      </div>

      {/* Last ad → sticky rectangle */}
      {stickyAd && (
        <div className="sticky top-6">
          <AdBox link={stickyAd.link} />
        </div>
      )}
    </div>
  )
}

export default VerticalAds