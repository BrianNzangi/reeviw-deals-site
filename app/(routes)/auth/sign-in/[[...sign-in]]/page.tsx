// app/(routes)/auth/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs"

export const runtime = "nodejs"

export const metadata = {
  title: "Sign In - Reeviw",
  description:
    "Sign in to your Reeviw account to access exclusive deals and save your favorites.",
}

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-600">
            Sign in to access exclusive deals and save your favorites
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md p-8 bg-white rounded-sm shadow border border-gray-100">
            <SignIn path="/auth/sign-in" routing="path" signUpUrl="/auth/sign-up" />
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Why Sign In?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Save and track your favorite deals</li>
              <li>• Get personalized deal recommendations</li>
              <li>• Access exclusive member-only discounts</li>
              <li>• Receive deal alerts for items you&apos;re watching</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}