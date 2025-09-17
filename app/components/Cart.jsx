"use client";
import { useState } from "react";

export default function Cart({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) {
  const [user, setUser] = useState({ name: "", email: "" });
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user.name || !user.email) {
      alert("Please enter your name and email!");
      return;
    }

    setIsCheckingOut(true);
    try {
      await onCheckout(user);
      setUser({ name: "", email: "" });
    } catch (error) {
      alert("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-white shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🛒</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-8">
                Add some items to get started!
              </p>
              <button
                onClick={onClose}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-6 p-6 bg-white border-2 border-black rounded-lg shadow-sm"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden">
                      <img
                        src={
                          item.image ||
                          `https://via.placeholder.com/80x80/000000/ffffff?text=${encodeURIComponent(
                            item.name
                          )}`
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="w-full h-full bg-gray-100 flex items-center justify-center"
                        style={{ display: "none" }}
                      >
                        <span className="text-2xl">👕</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 mb-1">Size: {item.size}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-lg font-bold text-black">
                          ${item.price}
                        </p>
                        <span className="text-gray-500">×</span>
                        <span className="text-lg font-semibold text-black">
                          {item.quantity}
                        </span>
                        <span className="text-gray-500">=</span>
                        <p className="text-xl font-bold text-black">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          onUpdateQuantity(index, item.quantity - 1)
                        }
                        className="w-10 h-10 rounded-full bg-black text-white hover:bg-gray-800 flex items-center justify-center font-bold transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-lg font-bold text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(index, item.quantity + 1)
                        }
                        className="w-10 h-10 rounded-full bg-black text-white hover:bg-gray-800 flex items-center justify-center font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-black hover:text-gray-600 p-2 transition-colors"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t bg-white shadow-lg">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {/* Total */}
              <div className="flex justify-between items-center text-2xl font-bold border-b pb-4">
                <span>Total:</span>
                <span className="text-black">${total.toFixed(2)}</span>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-black text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg disabled:opacity-50"
              >
                {isCheckingOut ? "Processing..." : "Complete Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
