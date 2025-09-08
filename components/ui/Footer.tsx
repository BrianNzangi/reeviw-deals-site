import Link from "next/link"
import NewsletterForm from "@/components/ui/NewsletterForm"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand - Left */}
          <div className="md:w-1/3">
            <h3 className="text-xl font-bold mb-4">Reeviw</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Find the best deals, coupons, and discounts from top retailers. 
              Save money on everything you love.
            </p>
            <div className="max-w-md">
              <NewsletterForm />
            </div>
          </div>

          {/* Links & Socials - Right */}
          <div className="mmd:w-2/3 flex justify-end gap-24">
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/deals" className="hover:text-white">Hot Deals</Link></li>
                <li><Link href="/listings" className="hover:text-white">Curated Lists</Link></li>
                <li><Link href="/newsletter" className="hover:text-white">Newsletter</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help-center" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact-us" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Socials */}
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Facebook</Link></li>
                <li><Link href="#" className="hover:text-white">Twitter</Link></li>
                <li><Link href="#" className="hover:text-white">Pinterest</Link></li>
                <li><Link href="#" className="hover:text-white">TikTok</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Reeviw. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}