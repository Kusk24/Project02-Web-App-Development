"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Header({ cartCount: initialCartCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(initialCartCount);
  const { user, logout, loading } = useAuth();
  
  // Load cart data from localStorage
  useEffect(() => {
    try {
      // Load cart count from localStorage
      const updateCartCount = () => {
        try {
          const cart = JSON.parse(localStorage.getItem('cart') || '[]');
          const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
          setCartCount(count);
        } catch (error) {
          console.error('Error loading cart:', error);
          setCartCount(0);
        }
      };

      updateCartCount();

      // Listen for cart updates
      window.addEventListener('cartUpdated', updateCartCount);
      window.addEventListener('storage', updateCartCount);

      return () => {
        window.removeEventListener('cartUpdated', updateCartCount);
        window.removeEventListener('storage', updateCartCount);
      };
    } catch (error) {
      console.error('Error in Header useEffect:', error);
    }
  }, []);

  // Update when prop changes
  useEffect(() => {
    setCartCount(initialCartCount);
  }, [initialCartCount]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    
    // Navigate to dynamic base path
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    window.location.href = basePath || '/';
  };

  if (loading) {
    return (
      <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-2xl font-bold">Style Store</span>
            <div>Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent group-hover:from-gray-700 group-hover:to-black transition-all duration-200">
              Style Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-black font-medium transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-black">
              Home
            </Link>
            <Link href="/shop" className="text-gray-600 hover:text-black font-medium transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-black">
              Shop
            </Link>
            {user && (
              <>
                <Link href="/profile" className="text-gray-600 hover:text-black font-medium transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-black">
                  Profile
                </Link>
                <Link href="/history" className="text-gray-600 hover:text-black font-medium transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-black">
                  Orders
                </Link>
              </>
            )}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <Link href="/cart" className="relative group p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-black transition-colors duration-200" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md animate-pulse">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Authentication */}
            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/profile" className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors duration-200" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-black font-medium transition-colors duration-200">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 font-medium transition-colors duration-200 shadow-md hover:shadow-lg">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? 
                <X className="w-6 h-6 text-gray-600" /> : 
                <Menu className="w-6 h-6 text-gray-600" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-4 py-3 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="block px-4 py-3 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              {user && (
                <>
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/history"
                    className="block px-4 py-3 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                </>
              )}
              
              {/* Mobile Auth */}
              <div className="border-t border-gray-100 mt-3 pt-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-4 py-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="block px-4 py-3 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-3 bg-black text-white rounded-lg font-medium transition-all duration-200 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}