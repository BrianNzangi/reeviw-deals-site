"use client"

import { FC } from "react"

const links = ["Categories", "Trending", "Back to school", "Prime"]

const CategoryNav: FC = () => {
  return (
    <div className="w-full bg-white border-b border-b-gray-200">
      <nav className="container flex gap-6 text-sm font-medium text-gray-700 py-3">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="hover:text-black transition-colors"
          >
            {link}
          </a>
        ))}
      </nav>
    </div>
  )
}

export default CategoryNav