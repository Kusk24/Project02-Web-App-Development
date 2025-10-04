"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  X,
  Upload,
  Check,
  ShoppingBag,
  Clock,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { items: cart, updateQuantity: updateCartQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showProofUpload, setShowProofUpload] = useState(false);
  const [uploadChoice, setUploadChoice] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const router = useRouter();

  // ✅ only use API url for fetch
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const total = getTotalPrice();

  const updateQuantity = (index, change) => {
    const item = cart[index];
    const newQuantity = (item.quantity || 1) + change;
    if (newQuantity <= 0) {
      // Pass both id and size to properly identify the item
      removeFromCart(item.id, item.size);
    } else {
      // Pass id, quantity, and size to properly update the item
      updateCartQuantity(item.id, newQuantity, item.size);
    }
  };

  const removeItem = (index) => {
    const item = cart[index];
    // Pass both id and size to properly identify the item
    removeFromCart(item.id, item.size);
  };

  const handleCheckoutClick = () => setShowCheckout(true);
  const handleUserSubmit = (e) => {
    e.preventDefault();
    setShowCheckout(false);
    setShowProofUpload(true);
  };
  const handleUploadChoice = (choice) => setUploadChoice(choice);
  const handleFileChange = (e) => setProofFile(e.target.files[0]);

  const calculateDeliveryDate = () =>
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const calculateCancellationDate = () =>
    new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleSubmitOrder = async () => {
    setUploading(true);
    try {
      const sessionRes = await fetch(`${apiUrl}/api/auth/session`, {
        method: "GET",
        credentials: "include",
      });
      if (!sessionRes.ok) {
        alert("❌ You must be logged in to place an order.");
        setUploading(false);
        return;
      }
      const sessionData = await sessionRes.json();
      const userId = sessionData.user?.id;

      const orderData = {
        userInfo,
        items: cart,
        total,
        status: uploadChoice === "now" && proofFile ? "paid" : "unpaid",
        paymentProof:
          uploadChoice === "now" && proofFile ? proofFile.name : null,
        deliveryEstimate:
          uploadChoice === "now" && proofFile ? calculateDeliveryDate() : null,
        cancellationDeadline:
          uploadChoice === "later" ? calculateCancellationDate() : null,
      };

      const response = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setUploadSuccess(true);
        setTimeout(() => {
          clearCart();
          router.push("/history");
        }, 2000);
      } else {
        const error = await response.json();
        alert(`Failed to submit order: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      alert("Error submitting order. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <ShoppingBag className="w-8 h-8" />
              Shopping Cart
            </h1>
            <p className="text-xl text-gray-300">
              {showProofUpload
                ? "Payment Proof Upload"
                : showCheckout
                ? "Checkout Information"
                : "Review your items"}
            </p>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cart Items View */}
          {!showCheckout && !showProofUpload && (
            <Card>
              <CardContent className="p-6">
                {cart.length === 0 ? (
                  // ✅ Empty Cart Message
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Looks like you haven't added anything yet.
                    </p>
                    <Button onClick={() => router.push("/shop")}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  // ✅ Normal Cart Flow
                  <>
                    <div className="space-y-6">
                      {cart.map((item, index) => (
                        <div
                          key={`${item.id}-${item.size}-${index}`}
                          className="flex items-center justify-between p-6 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-6">
                            <img
                              src={
                                item.image || "https://via.placeholder.com/80"
                              }
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900">
                                {item.name}
                              </h4>
                              <p className="text-gray-600">Size: {item.size}</p>
                              <p className="text-lg font-bold text-black">
                                ${item.price}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(index, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4 text-black" />
                              </Button>
                              <span className="w-12 text-center font-semibold text-lg text-black">
                                {item.quantity || 1}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(index, 1)}
                              >
                                <Plus className="w-4 h-4 text-black" />
                              </Button>
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeItem(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t mt-8 pt-6">
                      <div className="flex justify-between items-center text-2xl font-bold mb-6 text-black">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      <Button
                        onClick={handleCheckoutClick}
                        className="w-full"
                        size="lg"
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Checkout Form */}
          {showCheckout && (
            <Card>
              <CardHeader>
                <CardTitle className="text-black">
                  Checkout Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      required
                      value={userInfo.name}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, name: e.target.value })
                      }
                      className="text-black" // ✅ force text color
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      required
                      value={userInfo.email}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, email: e.target.value })
                      }
                      className="text-black" // ✅ force text color
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      required
                      value={userInfo.phone}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, phone: e.target.value })
                      }
                      className="text-black" // ✅ force text color
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Address
                    </label>
                    <textarea
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black" // ✅ added text-black
                      rows="4"
                      value={userInfo.address}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, address: e.target.value })
                      }
                    ></textarea>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center text-2xl font-bold mb-6 text-black">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Proof Upload Choice */}
          {showProofUpload && !uploadChoice && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Upload className="w-5 h-5" />
                  Payment Proof Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-8 p-6 bg-gray-50 rounded-lg text-black">
                  <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                  <p className="mb-2">
                    <strong>Total:</strong> ${total.toFixed(2)}
                  </p>
                  <p className="mb-4">
                    <strong>Items:</strong> {cart.length}
                  </p>
                  <div className="space-y-2">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>
                          {item.name} (Size: {item.size})
                        </span>
                        <span>×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4 text-black">
                  Choose Payment Option:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Upload Now */}
                  <div
                    onClick={() => handleUploadChoice("now")}
                    className="border-2 border-gray-300 rounded-lg p-6 cursor-pointer hover:border-black hover:bg-gray-50 transition-all"
                  >
                    <div className="flex flex-col items-center text-center">
                      <Upload className="w-12 h-12 mb-4 text-green-600" />
                      <h4 className="text-xl font-semibold mb-2 text-black">
                        Upload Now
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Upload payment proof immediately
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded p-3 w-full">
                        <p className="text-sm text-green-800">
                          ✓ Order marked as <strong>PAID</strong>
                          <br />✓ Delivery by:{" "}
                          <strong>{calculateDeliveryDate()}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Upload Later */}
                  <div
                    onClick={() => handleUploadChoice("later")}
                    className="border-2 border-gray-300 rounded-lg p-6 cursor-pointer hover:border-black hover:bg-gray-50 transition-all"
                  >
                    <div className="flex flex-col items-center text-center">
                      <Clock className="w-12 h-12 mb-4 text-orange-600" />
                      <h4 className="text-xl font-semibold mb-2 text-black">
                        Upload Later
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Upload within 24 hours
                      </p>
                      <div className="bg-orange-50 border border-orange-200 rounded p-3 w-full">
                        <p className="text-sm text-orange-800">
                          ⚠ Order marked as <strong>UNPAID</strong>
                          <br />⚠ Must upload by:{" "}
                          <strong>{calculateCancellationDate()}</strong>
                          <br />
                          <span className="text-xs">
                            or order will be cancelled
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Now Flow */}
          {showProofUpload && uploadChoice === "now" && !uploadSuccess && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Upload className="w-5 h-5" />
                  Upload Payment Proof
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      📦 Your order will be marked as <strong>PAID</strong> and
                      delivered by <strong>{calculateDeliveryDate()}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-black">
                      Upload Payment Proof (Image or PDF)
                    </label>
                    <Input
                      className="text-black" // ✅ force text color
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setUploadChoice(null)}
                      className="flex-1 text-black"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmitOrder}
                      disabled={uploading || !proofFile}
                      className="flex-1"
                      size="lg"
                    >
                      {uploading ? "Uploading..." : "Submit Order"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Later Flow */}
          {showProofUpload && uploadChoice === "later" && !uploadSuccess && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Clock className="w-5 h-5" />
                  Order Confirmation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3">
                      ⚠ Important Notice
                    </h3>
                    <ul className="space-y-2 text-orange-800">
                      <li>
                        • Your order will be marked as <strong>UNPAID</strong>
                      </li>
                      <li>
                        • You have until{" "}
                        <strong>{calculateCancellationDate()}</strong> to upload
                        payment proof
                      </li>
                      <li>
                        • Order will be automatically <strong>CANCELLED</strong>{" "}
                        if not paid within 24 hours
                      </li>
                      <li>
                        • You can upload proof from your Order History page
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-4 text-black">
                    <Button
                      variant="outline"
                      onClick={() => setUploadChoice(null)}
                      className="flex-1 text-black"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmitOrder}
                      disabled={uploading}
                      className="flex-1"
                      size="lg"
                    >
                      {uploading ? "Processing..." : "Confirm Order"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Message */}
          {uploadSuccess && (
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <Check className="w-20 h-20 mx-auto mb-6 text-green-600" />
                  <h3 className="text-3xl font-semibold text-green-800 mb-4">
                    Order Submitted Successfully!
                  </h3>
                  {uploadChoice === "now" ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <p className="text-green-800 text-lg mb-2">
                        ✓ Payment Status: <strong>PAID</strong>
                      </p>
                      <p className="text-green-800 text-lg">
                        📦 Estimated Delivery:{" "}
                        <strong>{calculateDeliveryDate()}</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <p className="text-orange-800 text-lg mb-2">
                        ⚠ Payment Status: <strong>UNPAID</strong>
                      </p>
                      <p className="text-orange-800 text-lg mb-2">
                        ⏰ Upload proof by:{" "}
                        <strong>{calculateCancellationDate()}</strong>
                      </p>
                      <p className="text-sm text-orange-600 mt-3">
                        Check your Order History to upload payment proof
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
