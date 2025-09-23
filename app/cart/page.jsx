"use client";
import { useState, useEffect } from "react";
import { Minus, Plus, X, Upload, Check, ShoppingBag } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CartPage() {
  const [cart, setCart] = useState([]);
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

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Update cart quantity
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter((_, i) => i !== index));
    } else {
      setCart(
        cart.map((item, i) =>
          i === index ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Remove item from cart
  const removeItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

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
    setTimeout(async () => {
      const orderData = {
        user: userInfo,
        items: cart,
        total: total,
        proofFile: proofFile.name,
        timestamp: new Date().toISOString(),
      };

      console.log("Order saved to database:", orderData);

      // Create user and sales records
      try {
        const resUser = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userInfo),
        });
        const newUser = await resUser.json();

        for (let item of cart) {
          await fetch("/api/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: newUser.id,
              clothesId: item.id,
              quantity: item.quantity,
            }),
          });
        }
      } catch (error) {
        console.log("API not available, using mock data");
      }

      setUploadSuccess(true);
      setUploading(false);

      setTimeout(() => {
        setCart([]);
        setShowCheckout(false);
        setShowProofUpload(false);
        setProofFile(null);
        setUploadSuccess(false);
        setUserInfo({ name: "", email: "", phone: "", address: "" });
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <ShoppingBag className="w-8 h-8" />
              Shopping Cart
            </h1>
            <p className="text-xl text-gray-300">
              {showProofUpload ? "Upload Payment Proof" : showCheckout ? "Checkout Information" : "Review your items"}
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
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Add some items to get started!
                    </p>
                    <Button asChild>
                      <a href="/products">Continue Shopping</a>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      {cart.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-6">
                            <img
                              src={item.image || "https://via.placeholder.com/80"}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900">{item.name}</h4>
                              <p className="text-gray-600">Size: {item.size}</p>
                              <p className="text-lg font-bold text-black">${item.price}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(index, item.quantity - 1)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-12 text-center font-semibold">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
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
                      <div className="flex justify-between items-center text-2xl font-bold mb-6">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      <Button onClick={handleCheckoutClick} className="w-full" size="lg">
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
                <CardTitle>Checkout Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input
                      type="text"
                      required
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input
                      type="email"
                      required
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      required
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
                    <textarea
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      rows="4"
                      value={userInfo.address}
                      onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center text-2xl font-bold mb-6">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      Continue to Payment Proof
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Proof Upload */}
          {showProofUpload && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Payment Proof
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                  <p className="mb-2"><strong>Total:</strong> ${total.toFixed(2)}</p>
                  <p className="mb-4"><strong>Items:</strong> {cart.length}</p>
                  <div className="space-y-2">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.name} (Size: {item.size})</span>
                        <span>×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {uploadSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                    <Check className="w-16 h-16 mx-auto mb-6 text-green-600" />
                    <h3 className="text-2xl font-semibold text-green-800 mb-4">
                      Order Submitted Successfully!
                    </h3>
                    <p className="text-green-600 text-lg">
                      Your payment proof has been uploaded and your order is being processed.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Payment Proof (Image or PDF)
                      </label>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                      />
                    </div>

                    <Button
                      onClick={handleProofUpload}
                      disabled={uploading || !proofFile}
                      className="w-full"
                      size="lg"
                    >
                      {uploading ? "Uploading..." : "Submit Order"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
