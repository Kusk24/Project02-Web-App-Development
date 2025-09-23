"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, Home, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header({ cartCount }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = document.cookie.includes("auth-token=");
    setIsLoggedIn(token);
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            StyleShop
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-700 hover:text-black font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center space-x-2 text-gray-700 hover:text-black font-medium"
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Button variant="ghost" asChild>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              asChild
            >
              <Link
                href="/cart"
                className="relative"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}