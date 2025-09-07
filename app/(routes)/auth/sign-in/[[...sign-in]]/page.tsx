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

        <div className="flex justify-center">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="text-center text-gray-500">
              <p className="mb-4">Authentication is currently disabled.</p>
              <p className="text-sm">Clerk integration will be enabled later.</p>
            </div>
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