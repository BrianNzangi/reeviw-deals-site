// File: middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/",                  // homepage is public
  "/auth/sign-in(.*)",  // sign-in page
  "/auth/sign-up(.*)",  // sign-up page
  "/deals",
  "/listings",
  "/newsletter",
  "/help-center",
  "/contact-us",
  "/privacy-policy",
  "/terms-of-service",
  "/categories/electronics",
  "/categories/fashion",
  "/categories/automotive",
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  if (!isPublicRoute(req) && !userId) {
    // user not signed in, redirect to custom sign-in page
    return NextResponse.redirect(new URL("/auth/sign-in", req.url))
  }

  // allow request to continue
  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}