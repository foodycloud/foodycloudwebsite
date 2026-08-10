import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Clock, MessageCircle, Instagram } from 'lucide-react'

export default function StoreFooter() {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-8 border-t border-stone-800">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group inline-block">
              <div className="relative w-12 h-12 bg-white rounded-xl overflow-hidden p-1 transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Foody Cloud"
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-white tracking-tight">
                  Foody Cloud
                </span>
                <span className="text-amber-500 text-sm font-medium">
                  Homely Taste, Every Time
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-stone-400 max-w-xs">
              Experience the warmth of home-cooked meals delivered straight to your door. Pure vegetarian, prepared with love and the finest ingredients.
            </p>
            <div className="inline-flex items-center gap-2 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-lg w-fit">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs font-semibold tracking-wider text-stone-300">FSSAI REGISTERED</span>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-5">
            <h3 className="text-white font-semibold text-lg mb-2">Contact Us</h3>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-sm text-stone-400">
                Chinar Park, Kolupukur<br />
                Kolkata, West Bengal
              </span>
            </div>
            <a href="tel:+919007182421" className="flex items-center gap-3 hover:text-white transition-colors group">
              <Phone className="w-5 h-5 text-amber-500 group-hover:text-amber-400 transition-colors" />
              <span className="text-sm font-medium">90071 82421</span>
            </a>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="text-sm text-stone-400">
                Lunch: 12 PM onwards<br />
                Dinner: 6 PM onwards
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-semibold text-lg mb-2">Quick Links</h3>
            <Link href="/menu" className="text-sm hover:text-amber-500 transition-colors">
              View Menu
            </Link>
            <Link href="/cart" className="text-sm hover:text-amber-500 transition-colors">
              Your Cart
            </Link>
            <a 
              href="https://instagram.com/foody.cloud" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-2 hover:text-amber-500 transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>@foody.cloud</span>
            </a>
            
            <div className="mt-4">
              <a
                href="https://wa.me/919007182421"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle className="w-5 h-5" />
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            &copy; {new Date().getFullYear()} Foody Cloud. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            100% Pure Vegetarian
          </div>
        </div>
      </div>
    </footer>
  )
}
