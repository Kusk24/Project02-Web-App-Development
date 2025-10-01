'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { getTotalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">Style Store</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-gray-700 hover:text-gray-900 transition-colors">
              Shop
            </Link>
            <Link href="/sale" className="text-gray-700 hover:text-gray-900 transition-colors">
              Sale
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors">
                  <User size={20} />
                  <span className="hidden md:inline">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
