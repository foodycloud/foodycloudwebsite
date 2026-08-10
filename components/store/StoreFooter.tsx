import Link from 'next/link'
import Image from 'next/image'
import { Clock, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react'
import { WHATSAPP_DISPLAY, getWhatsAppUrl } from '@/lib/storefront'

export default function StoreFooter() {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-stone-950 text-stone-300">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0">
              <Image
                src="/logo.png"
                alt="Foody Cloud logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-white">Foody Cloud</p>
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Pure veg home kitchen</p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-6 text-stone-400">
            Homestyle vegetarian meals cooked in small batches from Chinar Park, Kolupukur.
          </p>
          <p className="mt-4 text-xs text-stone-500">FSSAI: 22826136000840</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-white">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span>Chinar Park, Kolupukur</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-amber-400" />
              <a href="tel:+919007182421" className="transition hover:text-amber-300">{WHATSAPP_DISPLAY}</a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span>Lunch from 12:00 PM<br />Dinner from 6:00 PM</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-white">Order</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/menu" className="transition hover:text-amber-300">View menu</Link></li>
            <li><Link href="/cart" className="transition hover:text-amber-300">Review cart</Link></li>
            <li>
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-amber-300">
                <MessageCircle className="h-4 w-4" />
                WhatsApp order
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/foody.cloud" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-amber-300">
                <Instagram className="h-4 w-4" />
                @foody.cloud
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-stone-500">
        Copyright {new Date().getFullYear()} Foody Cloud. All rights reserved.
      </div>
    </footer>
  )
}
