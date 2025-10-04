"use client";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";

export default function ProductCard({ product, onAddToCart }) {
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 p-2 rounded-full shadow-md transition-all hover:scale-110"
          style={{ backgroundColor: 'white' }}
        >
          <Heart 
            className="w-5 h-5 transition-all" 
            style={{ color: isLiked ? 'var(--coral)' : 'var(--gray-light)' }}
            fill={isLiked ? 'var(--coral)' : 'none'}
          />
        </button>

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
              {product.originalPrice && (
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
            <p className="text-sm mb-3 line-clamp-2 min-h-[2.5rem]" style={{ color: 'var(--brown-soft)' }}>
              {product.description}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full py-3 px-4 rounded-full transition-all duration-300 font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--coral)', color: 'white' }}
        >
          <ShoppingBag className="w-5 h-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}