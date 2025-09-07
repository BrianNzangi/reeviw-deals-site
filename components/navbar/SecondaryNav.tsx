"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { useState } from "react"
import { CATEGORIES } from "@/lib/constants"

const SecondaryNav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const navLinks = [
    { label: "Tool Deals", href: "/categories/automotive" }, // Wire to automotive category
    { label: "Tech Deals", href: "/categories/electronics" }, // Wire to electronics category
    { label: "Apparel", href: "/categories/fashion" }, // Wire to fashion category
    { label: "Laptops & Computers", href: "/categories/electronics" }, // Wire to electronics category
  ]

  return (
    <nav className="bg-white border-b border-gray-200 z-40">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center py-3">
          <div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors duration-200"
              >
                Categories
                <Menu className={`w-4 h-4 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 transform transition-all duration-300 ease-out animate-in slide-in-from-left-2">
                  <div className="py-3">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900">Shop by Category</h3>
                    </div>
                    <div className="py-2">
                      {CATEGORIES.map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.id}`}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-xl group-hover:scale-110 transition-transform duration-200">{category.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium group-hover:text-blue-600">{category.name}</div>
                            <div className="text-xs text-gray-500 group-hover:text-blue-500">{category.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Other Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Navigation - Horizontal Scroll */}
        <div className="md:hidden py-2">
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-1">
            {/* Mobile Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap py-2 transition-colors duration-200"
              >
                Categories
                <Menu className={`w-3 h-3 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 transform transition-all duration-300 ease-out animate-in slide-in-from-left-2">
                  <div className="py-2">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Categories</h3>
                    </div>
                    <div className="py-1">
                      {CATEGORIES.map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.id}`}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-lg group-hover:scale-110 transition-transform duration-200">{category.icon}</span>
                          <div className="font-medium group-hover:text-blue-600">{category.name}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Other Mobile Links */}
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap py-2 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default SecondaryNav
