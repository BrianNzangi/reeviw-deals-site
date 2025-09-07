"use client"

import { FC, useState } from "react"
import Link from "next/link"
import { CATEGORIES } from "@/lib/constants"
import { Menu } from "lucide-react"

const navLinks = [
  { label: "Categories", href: "#", icon: <Menu size={16} /> },
  { label: "Tool Deals", href: "/categories/automotive" },
  { label: "Tech Deals", href: "/categories/electronics" },
  { label: "Apparel", href: "/categories/fashion" },
  { label: "Laptops & Computers", href: "/categories/electronics" },
]

const CategoryNav: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="w-full bg-white border-b border-b-gray-200">
      <nav className="container flex gap-6 text-sm font-medium text-gray-700 py-3">
        {navLinks.map((link) =>
          link.label === "Categories" ? (
            <button
              key={link.label}
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="flex items-center gap-2 hover:text-black transition-colors"
            >
              {link.icon && <span className="text-gray-600">{link.icon}</span>}
              <span>{link.label}</span>
            </button>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-2 hover:text-black transition-colors"
            >
              {link.icon && <span className="text-gray-600">{link.icon}</span>}
              <span>{link.label}</span>
            </Link>
          )
        )}
      </nav>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Categories</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="py-4 overflow-y-auto h-[calc(100%-60px)]">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="flex items-center px-4 py-3 text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
              onClick={() => setIsSidebarOpen(false)}
            >
              <div className="flex-1">
                <div className="font-medium text-lg group-hover:text-blue-600">
                  {category.name}
                </div>
                <div className="text-sm text-gray-500 group-hover:text-blue-500">
                  {category.description}
                </div>
              </div>
              <span className="ml-auto text-2xl group-hover:scale-110 transition-transform duration-200">
                {category.icon}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryNav