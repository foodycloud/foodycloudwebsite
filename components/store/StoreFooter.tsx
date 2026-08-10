import Link from 'next/link'
import { MapPin, Phone, Clock, Instagram } from 'lucide-react'

export default function StoreFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">FC</span>
            </div>
            <span className="font-display font-bold text-white">Foody Cloud</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Pure Veg • Home Kitchen<br />
            Freshly Cooked • Purely Homemade • Made with Love
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>FSSAI: 22826136000840</span>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact & Location</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <span>Chinar Park, Kolupukur</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <a href="tel:+919007182421" className="hover:text-amber-400 transition">90071 82421</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p>Lunch: 12:00 PM onwards</p>
                <p>Dinner: 6:00 PM onwards</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/menu" className="hover:text-amber-400 transition">View Full Menu</Link></li>
            <li><Link href="/cart" className="hover:text-amber-400 transition">Your Cart</Link></li>
            <li>
              <a href="https://www.instagram.com/foody.cloud" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-400 transition">
                <Instagram className="w-4 h-4" />
                @foody.cloud
              </a>
            </li>
            <li>
              <a href="https://wa.me/919007182421" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">
                WhatsApp Order
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-600">
        © {new Date().getFullYear()} Foody Cloud. All rights reserved. Pure Food • Pure Love • Pure Satisfaction
      </div>
    </footer>
  )
}
