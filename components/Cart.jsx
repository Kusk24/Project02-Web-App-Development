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
  const [showCheckout, setShowCheckout] = useState(false);
  const [showProofUpload, setShowProofUpload] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckoutClick = () => {
    setShowCheckout(true);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    setShowCheckout(false);
    setShowProofUpload(true);
  };

  const handleFileChange = (e) => {
    setProofFile(e.target.files[0]);
    setUploadSuccess(false);
  };

  const handleProofUpload = async () => {
    if (!proofFile) {
      alert("Please select a proof file");
      return;
    }

    setUploading(true);

    // Mock upload and database save
    setTimeout(() => {
      const orderData = {
        user: userInfo,
        items: cart,
        total: total,
        proofFile: proofFile.name,
        timestamp: new Date().toISOString(),
      };

      console.log("Order saved to database:", orderData);
      setUploadSuccess(true);
      setUploading(false);

      setTimeout(() => {
        onCheckout(userInfo);
        handleClose();
      }, 2000);
    }, 2000);
  };

  const handleClose = () => {
    onClose();
    setShowCheckout(false);
    setShowProofUpload(false);
    setProofFile(null);
    setUploadSuccess(false);
    setUserInfo({ name: "", email: "", phone: "", address: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {showProofUpload ? "Upload Payment Proof" : showCheckout ? "Checkout" : "Shopping Cart"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Cart Items View */}
        {!showCheckout && !showProofUpload && (
          <>
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image || "https://via.placeholder.com/60"}
                          alt={item.name}
                          className="w-15 h-15 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-gray-600">Size: {item.size}</p>
                          <p className="font-bold">${item.price}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded flex items-center justify-center"
                        >
                          +
                        </button>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded flex items-center justify-center ml-2"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-6">
                <div className="flex justify-between items-center text-xl font-bold mb-4">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

        {/* Checkout Form */}
        {showCheckout && (
          <form onSubmit={handleUserSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={userInfo.name}
                onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={userInfo.email}
                onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                rows="3"
                value={userInfo.address}
                onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
              ></textarea>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Continue to Payment Proof
              </button>
            </div>
          </form>
        )}

        {/* Proof Upload */}
        {showProofUpload && (
          <div className="p-6">
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <p><strong>Total:</strong> ${total.toFixed(2)}</p>
              <p><strong>Items:</strong> {cart.length}</p>
            </div>

            {uploadSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Order Submitted Successfully!
                </h3>
                <p className="text-green-600">
                  Your payment proof has been uploaded and your order is being processed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Payment Proof (Image or PDF)
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <button
                  onClick={handleProofUpload}
                  disabled={uploading || !proofFile}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Submit Order"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
