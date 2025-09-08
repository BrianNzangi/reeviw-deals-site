import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import Script from "next/script"
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
  title: "Reeviw: The Best Deals, Coupons, and Discounts Online",
  description: "Your search for great deals ends here. Reeviw brings you the best bargains, discounts, promo codes, and price comparisons from top online stores, all in one place.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Reeviw: Find the Best Deals Online",
    description: "Your search for great deals ends here. Reeviw brings you the best bargains, discounts, promo codes, and price comparisons from top online stores, all in one place.",
    url: "https://reeviw.com",
    siteName: "Reeviw",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reeviw: Find the Best Deals Online",
    description: "Your search for great deals ends here. Reeviw brings you the best bargains, discounts, promo codes, and price comparisons from top online stores, all in one place.",
    images: ["/og-image.jpg"],
    site: "@reeviwdeals",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD snippet */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Reeviw",
              "url": "https://reeviw.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://reeviw.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HS6ED8B6E0"
          strategy="afterInteractive"
          async
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HS6ED8B6E0');
          `}
        </Script>
        {/* Adsense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7762839935165975"
          crossOrigin="anonymous"
        />
        {/* Pinterest Verification */}
        <meta
          name="p:domain_verify"
          content="7a70bcd06dbf1d00b41791459e382c76"
        />
        {/* Meta Pixel */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2932920156899044');
          fbq('track', 'PageView');
        `}
      </Script>

      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=2932920156899044&ev=PageView&noscript=1"
        />
      </noscript>
      </head>
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