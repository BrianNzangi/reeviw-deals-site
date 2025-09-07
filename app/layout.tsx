import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import TopNotice from "@/components/navbar/TopNotice"
import MainNav from "@/components/navbar/MainNav"
import SecondaryNav from "@/components/navbar/SecondaryNav"
import Footer from "@/components/ui/Footer"
import { ClerkProvider } from "@clerk/nextjs"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Reeviw - Find the Best Deals, Coupons, and Discounts Online",
  description: "Reeviw helps you discover the best deals, coupons, and discounts.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ClerkProvider
        signInUrl="/auth/sign-in"
        signUpUrl="/auth/sign-up"
        afterSignInUrl="/"
        afterSignUpUrl="/"
      >
        <body className={`${spaceGrotesk.variable} antialiased`}>
          <TopNotice />
          <MainNav />
          <SecondaryNav />
          <main>{children}</main>
          <Footer />
        </body>
      </ClerkProvider>
    </html>
  )
}
