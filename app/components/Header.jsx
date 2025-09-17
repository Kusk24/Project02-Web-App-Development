"use client";
import { useState } from "react";

export default function Header({ cartCount, onCartClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Debug: Log cart count
  console.log("Cart count:", cartCount);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-black">
              <span className="text-gray-600">Style</span>Hub
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="/"
              className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors"
            >
              Home
            </a>
            <a
              href="/products"
              className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors"
            >
              Products
            </a>
            <a
              href="/about"
              className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors"
            >
              About
            </a>
            <a
              href="/contact"
              className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Cart Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="relative bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 13h10l4-8H5.4l7.6 8zM9 19a2 2 0 100-4 2 2 0 000 4zM19 19a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black border-2 border-black text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg z-10">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
              <a
                href="/"
                className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium"
              >
                Home
              </a>
              <a
                href="/products"
                className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium"
              >
                Products
              </a>
              <a
                href="/about"
                className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium"
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
