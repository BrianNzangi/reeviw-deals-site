"use client"

import { FC } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs"

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

          {/* Authentication */}
          <div className="flex items-center gap-4 text-sm">
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 hover:underline text-white">
                Sign In
              </button>
            </SignInButton>
            <SignInButton mode="modal" forceRedirectUrl="/">
              <button className="bg-white text-[#1F2323] px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
                Sign Up
              </button>
            </SignInButton>
            <UserButton afterSignOutUrl="/" />
          </div>
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

            {/* Authentication - Mobile */}
            <div className="flex items-center gap-3 text-xs">
              <SignInButton mode="modal">
                <button className="flex items-center gap-1 hover:underline">
                  <span>Sign In</span>
                </button>
              </SignInButton>
              <SignInButton mode="modal" forceRedirectUrl="/">
                <button className="bg-white text-[#1F2323] px-3 py-1.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-xs">
                  Sign Up
                </button>
              </SignInButton>
              <UserButton afterSignOutUrl="/" />
            </div>
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