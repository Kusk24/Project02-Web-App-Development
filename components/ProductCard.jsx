"use client";
import { useState } from "react";

export default function ProductCard({ product, onAddToCart }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      {/* Product Image */}
      <div className="relative w-full h-48 flex items-center justify-center bg-gray-50">
        {!imageError ? (
          <img
            src={
              product.image ||
              `https://via.placeholder.com/300x400/6366f1/ffffff?text=${encodeURIComponent(
                product.name
              )}`
            }
            alt={product.name}
            className="max-h-full max-w-full object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <div className="text-4xl mb-2">👕</div>
              <div className="text-black font-medium">{product.name}</div>
            </div>
          </div>
        )}

        {/* Sale Badge */}
        {product.sale && (
          <div className="absolute top-2 left-2 bg-white text-black border border-black px-2 py-1 rounded-full text-xs font-bold">
            SALE
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-black">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <div className="text-sm text-gray-600">Size: {product.size}</div>
          </div>

          {/* Product Description */}
          {product.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
              {product.description}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 font-medium mt-auto"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}