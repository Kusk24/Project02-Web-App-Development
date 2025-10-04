"use client";

import { useState } from "react";
import { ShoppingCart, Menu, X, User, LogOut, Heart } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const { getTotalItems } = useCart();

  const cartCount = getTotalItems();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  if (loading) {
    return (
      <header className="bg-white shadow-sm sticky top-0 z-50" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-2xl font-bold" style={{ color: 'var(--brown-soft)' }}>✨ StyleHub</span>
            <div style={{ color: 'var(--brown-soft)' }}>Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="shadow-sm sticky top-0 z-50" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-bold transition-all duration-200" style={{ color: 'var(--brown-soft)' }}>
              ✨ StyleHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="font-medium transition-all duration-200 hover:scale-105"
              style={{ color: 'var(--brown-soft)' }}
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="font-medium transition-all duration-200 hover:scale-105"
              style={{ color: 'var(--brown-soft)' }}
            >
              Shop
            </Link>
            {user && (
              <>
                <Link 
                  href="/profile" 
                  className="font-medium transition-all duration-200 hover:scale-105"
                  style={{ color: 'var(--brown-soft)' }}
                >
                  Profile
                </Link>
                <Link 
                  href="/history" 
                  className="font-medium transition-all duration-200 hover:scale-105"
                  style={{ color: 'var(--brown-soft)' }}
                >
                  Orders
                </Link>
              </>
            )}
          </nav>

          {/* Right side desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/cart" className="relative p-2 transition-transform hover:scale-110">
              <ShoppingCart className="w-6 h-6" style={{ color: 'var(--brown-soft)' }} />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md"
                  style={{ backgroundColor: 'var(--coral)' }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all hover:scale-105 shadow-sm"
                  style={{ backgroundColor: 'var(--cloud-blue-light)', color: 'var(--brown-soft)' }}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="p-2 rounded-full transition-all hover:scale-110"
                  style={{ backgroundColor: '#EF4444' }}
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-white" />
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-5 py-2 font-medium rounded-full transition-all hover:scale-105"
                  style={{ color: 'var(--brown-soft)' }}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2 text-white rounded-full font-medium shadow-md transition-all hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: 'var(--coral)' }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-full transition-all hover:scale-110"
            style={{ backgroundColor: 'var(--cloud-blue-light)' }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Open menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" style={{ color: 'var(--brown-soft)' }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: 'var(--brown-soft)' }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden shadow-lg transition-all duration-300 ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
        style={{ backgroundColor: 'var(--cream-warm)' }}
      >
        <nav className="flex flex-col px-4 py-4 space-y-2">
          <Link 
            href="/" 
            className="py-2 px-4 rounded-full transition-all hover:scale-105"
            style={{ color: 'var(--brown-soft)', backgroundColor: 'var(--cloud-blue-light)' }}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/shop" 
            className="py-2 px-4 rounded-full transition-all hover:scale-105"
            style={{ color: 'var(--brown-soft)', backgroundColor: 'var(--cloud-blue-light)' }}
            onClick={() => setIsMenuOpen(false)}
          >
            Shop
          </Link>
          {user && (
            <>
              <Link 
                href="/profile" 
                className="py-2 px-4 rounded-full transition-all hover:scale-105"
                style={{ color: 'var(--brown-soft)', backgroundColor: 'var(--cloud-blue-light)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link 
                href="/history" 
                className="py-2 px-4 rounded-full transition-all hover:scale-105"
                style={{ color: 'var(--brown-soft)', backgroundColor: 'var(--cloud-blue-light)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Orders
              </Link>
            </>
          )}
          <Link 
            href="/cart" 
            className="flex items-center py-2 px-4 rounded-full transition-all hover:scale-105"
            style={{ color: 'var(--brown-soft)', backgroundColor: 'var(--mint)' }}
            onClick={() => setIsMenuOpen(false)}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart
            {cartCount > 0 && (
              <span 
                className="ml-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                style={{ backgroundColor: 'var(--coral)' }}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center py-2 px-4 rounded-full transition-all hover:scale-105 text-white"
              style={{ backgroundColor: '#EF4444' }}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          ) : (
            <>
              <Link 
                href="/login" 
                className="py-2 px-4 rounded-full text-center transition-all hover:scale-105"
                style={{ color: 'var(--brown-soft)', backgroundColor: 'var(--cloud-blue-light)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="py-2 px-4 text-white rounded-full text-center font-medium shadow-md transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--coral)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}