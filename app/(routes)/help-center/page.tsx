import React from 'react';

export const metadata = {
  title: 'Help Center | Reeviw',
  description: 'Find answers to frequently asked questions about Reeviw.',
};

export default function HelpCenterPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mb-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Help Center</h1>
        <p className="mt-4 text-lg text-gray-500">
          Find answers to frequently asked questions about our services
        </p>
      </div>
      
      <div className="space-y-12">
        {/* Account & Registration */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account & Registration</h2>
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">How do I create an account?</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <p className="text-gray-600">
                  To create an account, click on the "Sign In" button in the top right corner of the page. 
                  Then select "Create an account" and follow the instructions to complete your registration.
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Is registration required to use Bargainly?</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <p className="text-gray-600">
                  No, you can browse deals and products without registering. However, creating an account allows you to save favorite deals, 
                  receive personalized recommendations, and get notified about price drops on items you're interested in.
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">How do I reset my password?</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <p className="text-gray-600">
                  Click on the "Sign In" button, then select "Forgot password?" and enter your email address. 
                  We'll send you instructions on how to reset your password.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Deals & Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Deals & Products</h2>
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">How are deals selected for Bargainly?</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <p className="text-gray-600">
                  Our team of deal experts manually reviews and selects the best deals from hundreds of retailers. 
                  We consider factors like discount percentage, product quality, retailer reputation, and user feedback 
                  to ensure we only feature the most valuable deals.
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">How often are new deals added?</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <p className="text-gray-600">
                  We add new deals throughout the day, every day. The frequency increases during major shopping events 
                  like Black Friday, Cyber Monday, and Prime Day. For the most up-to-date deals, we recommend checking 
                  the site regularly or subscribing to our newsletter.
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">What if a deal is no longer available?</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <p className="text-gray-600">
                  Deals can expire quickly due to limited stock or time-limited offers. If you find a deal that's no longer 
                  available, please let us know through our Contact Us page so we can update our listings.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cashback & Rewards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cashback & Rewards</h2>
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">How does cashback work on Bargainly?</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <p className="text-gray-600">
                  When you make a purchase through our affiliate links, we earn a commission. We share a portion of this 
                  commission with you as cashback. To earn cashback, you must be logged into your Bargainly account 
                  before clicking on a deal link and completing your purchase.
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">When will I receive my cashback?</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <p className="text-gray-600">
                  Cashback typically appears as "Pending" in your account within 7 days of purchase. It becomes available 
                  for withdrawal after the retailer's return period has ended, usually 30-90 days depending on the store. 
                  This ensures there are no returns or cancellations before the cashback is finalized.
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">How can I withdraw my cashback?</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <p className="text-gray-600">
                  Once your cashback is available, you can withdraw it through PayPal, direct bank transfer, or as gift cards 
                  to popular retailers (often with bonus value). Go to your account dashboard and select "Withdraw Cashback" 
                  to see all available options. The minimum withdrawal amount is $10.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Technical Issues */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Issues</h2>
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">The website is not loading properly. What should I do?</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <p className="text-gray-600">
                  Try clearing your browser cache and cookies, or try using a different browser. If the issue persists, 
                  it might be a temporary server problem. Please try again later or contact our support team.
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">I'm not receiving email notifications. What's wrong?</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <p className="text-gray-600">
                  First, check your spam or junk folder. If you still can't find our emails, make sure you've added our email 
                  address to your contacts list. You can also verify your email preferences in your account settings to ensure 
                  notifications are enabled.
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">How do I report a bug or technical issue?</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <p className="text-gray-600">
                  Please visit our Contact Us page and select "Problem" as the reason for your support request. Include as much 
                  detail as possible about the issue, including what device and browser you're using, and any error messages you received.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6">Our support team is here to help you with any other questions you might have.</p>
        <a href="/contact-us" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Contact Support
        </a>
      </div>
    </div>
  );
}