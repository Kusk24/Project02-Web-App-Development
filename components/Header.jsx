"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Header({ cartCount: initialCartCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(initialCartCount);
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  useEffect(() => {
    setCartCount(initialCartCount);
  }, [initialCartCount]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
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
            <Link href="/" className="text-gray-600 hover:text-black">Home</Link>
            <Link href="/shop" className="text-gray-600 hover:text-black">Shop</Link>
            {user && (
              <>
                <Link href="/profile" className="text-gray-600 hover:text-black">Profile</Link>
                <Link href="/history" className="text-gray-600 hover:text-black">Orders</Link>
              </>
            )}
          </nav>

          {/* Right side desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link href="/profile" className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-full">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-100">
                  <LogOut className="w-5 h-5 text-gray-600 hover:text-red-500" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-gray-600">Login</Link>
                <Link href="/register" className="px-4 py-2 bg-black text-white rounded-full">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Open menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white shadow-lg border-t border-gray-100 transition-all duration-300 ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <nav className="flex flex-col px-4 py-4 space-y-2">
          <Link href="/" className="text-gray-700 py-2 px-2 rounded hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/shop" className="text-gray-700 py-2 px-2 rounded hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Shop</Link>
          {user && (
            <>
              <Link href="/profile" className="text-gray-700 py-2 px-2 rounded hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              <Link href="/history" className="text-gray-700 py-2 px-2 rounded hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Orders</Link>
            </>
          )}
          <Link href="/cart" className="flex items-center py-2 px-2 rounded hover:bg-gray-100 text-gray-700" onClick={() => setIsMenuOpen(false)}>
            <ShoppingCart className="w-5 h-5 mr-2 text-black" />
            Cart
            {cartCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="flex items-center py-2 px-2 rounded hover:bg-gray-100 text-gray-700"
              >
                <LogOut className="w-5 h-5 mr-2 text-gray-600" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="py-2 px-2 rounded hover:bg-gray-100 text-gray-700" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link href="/register" className="py-2 px-2 bg-black text-white rounded-full text-center" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}