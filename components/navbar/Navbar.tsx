"use client"

import { FC } from "react"
import TopNotice from "./TopNotice"
import MainNav from "./MainNav"
import CategoryNav from "./CategoryNav"

const Navbar: FC = () => {
  return (
    <header className="w-full">
      <TopNotice />
      <MainNav />
      <CategoryNav />
    </header>
  )
}

export default Navbar