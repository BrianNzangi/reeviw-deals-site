import { SignUp } from "@clerk/nextjs"

export const metadata = {
  title: "Sign Up - Reeviw",
  description: "Create your Reeviw account to access exclusive deals and personalized recommendations.",
}

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Join Reeviw Deals</h1>
          <p className="text-gray-600">
            Create your account and start saving on the best deals
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-200">
            <SignUp />
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Member Benefits</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Free account with no monthly fees</li>
              <li>• Personalized deal recommendations</li>
              <li>• Early access to flash sales</li>
              <li>• Deal alerts for your wishlist items</li>
              <li>• Track price history and trends</li>
            </ul>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
