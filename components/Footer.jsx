import Link from "next/link";
import { Heart, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto shadow-lg" style={{ backgroundColor: 'var(--cloud-blue-light)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--brown-soft)' }}>
              <span>✨</span>
              <span>StyleHub</span>
            </h3>
            <p className="mb-4" style={{ color: 'var(--brown-soft)' }}>
              Your premier destination for stylish and affordable clothing. We believe everyone deserves to look and feel their best! 💖
            </p>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--brown-soft)' }}>
              <Mail className="w-4 h-4" />
              <span>u6612054@au.edu</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--brown-soft)' }}>
              <span>🔗</span>
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="transition-all hover:translate-x-1 inline-block"
                  style={{ color: 'var(--brown-soft)' }}
                >
                  → Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/shop" 
                  className="transition-all hover:translate-x-1 inline-block"
                  style={{ color: 'var(--brown-soft)' }}
                >
                  → Shop
                </Link>
              </li>
              <li>
                <Link 
                  href="/cart" 
                  className="transition-all hover:translate-x-1 inline-block"
                  style={{ color: 'var(--brown-soft)' }}
                >
                  → Cart
                </Link>
              </li>
              <li>
                <Link 
                  href="/profile" 
                  className="transition-all hover:translate-x-1 inline-block"
                  style={{ color: 'var(--brown-soft)' }}
                >
                  → Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Team Members */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--brown-soft)' }}>
              <span>👥</span>
              <span>Our Team</span>
            </h4>
            <ul className="space-y-2" style={{ color: 'var(--brown-soft)' }}>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--coral)' }}></span>
                <span>Win Yu Maung - 6612054</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--mint-vibrant)' }}></span>
                <span>Sam Yati - 6611982</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--lavender)' }}></span>
                <span>Phonvan Deelertpattana - 6610607</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 text-center border-t-2" style={{ borderColor: 'var(--cloud-blue)', color: 'var(--brown-soft)' }}>
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span>© 2025 StyleHub. All rights reserved.</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 inline animate-pulse" style={{ color: 'var(--coral)' }} fill="var(--coral)" /> for fashion lovers
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}