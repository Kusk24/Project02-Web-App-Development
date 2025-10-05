"use client";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";

export default function ProductCard({ product, onAddToCart, isOwnListing = false, showListedBy = false }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className="rounded-3xl overflow-hidden flex flex-col shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
      style={{ backgroundColor: 'white' }}
    >
      {/* Product Image */}
      <div className="relative w-full h-48 flex items-center justify-center" style={{ backgroundColor: 'var(--cream-warm)' }}>
        {!imageError ? (
          <img
            src={
              product.image ||
              `https://via.placeholder.com/300x400/BCE2F5/5A4A43?text=${encodeURIComponent(
                product.name
              )}`
            }
            alt={product.name}
            className="max-h-full max-w-full object-contain p-2"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--cloud-blue-light) 0%, var(--cream) 100%)' }}>
            <div className="text-center">
              <div className="text-5xl mb-2">👕</div>
              <div className="font-medium" style={{ color: 'var(--brown-soft)' }}>{product.name}</div>
            </div>
          </div>
        )}

        {/* Sale Badge */}
        {product.sale && (
          <div 
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-md"
            style={{ backgroundColor: 'var(--coral)', color: 'white' }}
          >
            ✨ SALE
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-lg font-bold mb-2 line-clamp-2" style={{ color: 'var(--brown-soft)' }}>
            {product.name}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold" style={{ color: 'var(--brown-soft)' }}>
                ${product.price}
              </span>
              {product.sale && product.originalPrice && (
                <span className="text-sm line-through" style={{ color: 'var(--gray-light)' }}>
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <div 
              className="text-sm px-2 py-1 rounded-full font-medium"
              style={{ backgroundColor: 'var(--lavender)', color: 'var(--brown-soft)' }}
            >
              {product.size}
            </div>
          </div>

          {/* Product Description */}
          {product.description && (
            <p className="text-sm mb-3" style={{ color: 'var(--brown-soft)', lineHeight: '1.5' }}>
              {product.description}
            </p>
          )}

          {/* Condition (for user listings) */}
          {product.condition && (
            <p className="text-sm mb-1" style={{ color: 'var(--gray-light)' }}>
              {product.condition}
            </p>
          )}

          {/* Listed By (for marketplace) */}
          {showListedBy && product.userName && (
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--brown-soft)' }}>
              Listed by {product.userName}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        {isOwnListing ? (
          <div
            className="w-full py-3 px-4 rounded-full font-bold shadow-md text-center"
            style={{ backgroundColor: 'var(--gray-light)', color: 'white', cursor: 'not-allowed' }}
          >
            Your Listing
          </div>
        ) : (
          <button
            onClick={() => onAddToCart(product)}
            className="w-full py-3 px-4 rounded-full transition-all duration-300 font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--coral)', color: 'white' }}
          >
            <ShoppingBag className="w-5 h-5" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}