"use client"

import { FC } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, User } from "lucide-react"

const MainNav: FC = () => {

  return (
    <div className="w-full bg-[#1F2323] text-white">
      <div className="container px-4 md:px-6">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/reeviw-logo.png"
              alt="Reeviw"
              width={140}
              height={40}
              priority
            />
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search deals, coupons, stores, and more..."
                className="w-full rounded-full px-4 py-2 bg-white text-black placeholder-gray-500 focus:outline-none"
              />
              <Search className="absolute right-3 top-2.5 text-gray-500 h-5 w-5" />
            </div>
          </div>

          {/* Sign In */}
          <button className="flex items-center gap-2 text-sm hover:underline">
            <User className="h-5 w-5" />
            Sign In
          </button>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Top Row: Logo and Sign In */}
          <div className="flex items-center justify-between py-4">
            {/* Logo - Mobile */}
            <Link href="/" className="flex items-center">
              <Image
                src="/reeviw-logo.png"
                alt="Reeviw"
                width={100}
                height={28}
                priority
              />
            </Link>

            {/* Sign In - Mobile */}
            <button className="flex items-center gap-1 text-xs hover:underline">
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          </div>

          {/* Search Bar - Mobile (Below) */}
          <div className="pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search deals, coupons, stores..."
                className="w-full rounded-full px-4 py-2.5 bg-white text-black placeholder-gray-500 focus:outline-none text-sm"
              />
              <Search className="absolute right-3 top-2.5 text-gray-500 h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainNav