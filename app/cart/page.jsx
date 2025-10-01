"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, X, Upload, Check, ShoppingBag, Clock } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CartPage() {
  const [cart, setCart] = useState([]);
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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load cart from localStorage ONLY on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCart(Array.isArray(parsedCart) ? parsedCart : []);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        setCart([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();

    // Listen for external cart updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []); // Empty dependency array - only run once on mount

  // Save cart to localStorage whenever cart changes (but don't trigger reload)
  useEffect(() => {
    if (!isLoading && cart.length >= 0) {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
        // Don't dispatch event here to avoid infinite loop
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    }
  }, [cart, isLoading]);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Update cart quantity
  const updateQuantity = (index, change) => {
    const newCart = [...cart];
    const newQuantity = (newCart[index].quantity || 1) + change;
    
    if (newQuantity <= 0) {
      removeItem(index);
      return;
    }
    
    newCart[index].quantity = newQuantity;
    setCart(newCart);
  };

  // Remove item from cart
  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleCheckoutClick = () => {
    setShowCheckout(true);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    setShowCheckout(false);
    setShowProofUpload(true);
  };

  const handleUploadChoice = (choice) => {
    setUploadChoice(choice);
  };

  const handleFileChange = (e) => {
    setProofFile(e.target.files[0]);
    setUploadSuccess(false);
  };

  const calculateDeliveryDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 5);
    return today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateCancellationDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleSubmitOrder = async () => {
    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      
      const orderData = {
        user: userInfo,
        items: cart,
        total: total,
        paymentStatus: uploadChoice === 'now' && proofFile ? 'paid' : 'unpaid',
        paymentProof: uploadChoice === 'now' && proofFile ? proofFile.name : null,
        status: 'pending',
        deliveryEstimate: uploadChoice === 'now' && proofFile ? calculateDeliveryDate() : null,
        cancellationDeadline: uploadChoice === 'later' ? calculateCancellationDate() : null,
      };

      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('Submitting order to database:', orderData);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const savedOrder = await response.json();
        console.log('Order saved to database:', savedOrder);
        
        // Also save to localStorage as backup
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        existingOrders.push(savedOrder);
        localStorage.setItem('orders', JSON.stringify(existingOrders));

        setUploadSuccess(true);

        setTimeout(() => {
          setCart([]);
          localStorage.removeItem('cart');
          setShowCheckout(false);
          setShowProofUpload(false);
          setProofFile(null);
          setUploadSuccess(false);
          setUploadChoice(null);
          setUserInfo({ name: "", email: "", phone: "", address: "" });
          window.dispatchEvent(new Event("cartUpdated"));
          router.push('/history');
        }, 3000);
      } else {
        const error = await response.json();
        console.error('Order submission failed:', error);
        alert(`Failed to submit order: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartCount={0} />
        
        <section className="bg-gradient-to-r from-black to-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <ShoppingBag className="w-8 h-8" />
                Shopping Cart
              </h1>
              <p className="text-xl text-gray-300">Your cart is currently empty</p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-400" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                  <Button 
                    onClick={() => router.push("/products")}
                    size="lg"
                    className="px-8 py-3"
                  >
                    Start Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <ShoppingBag className="w-8 h-8" />
              Shopping Cart
            </h1>
            <p className="text-xl text-gray-300">
              {showProofUpload ? "Payment Proof Upload" : showCheckout ? "Checkout Information" : "Review your items"}
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
                <div className="space-y-6">
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${item.size}-${index}`} className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
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
                            onClick={() => updateQuantity(index, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold text-lg">
                            {item.quantity || 1}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(index, 1)}
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
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Payment Proof Upload
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

                <h3 className="text-lg font-semibold mb-4">Choose Payment Option:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Upload Now */}
                  <div 
                    onClick={() => handleUploadChoice('now')}
                    className="border-2 border-gray-300 rounded-lg p-6 cursor-pointer hover:border-black hover:bg-gray-50 transition-all"
                  >
                    <div className="flex flex-col items-center text-center">
                      <Upload className="w-12 h-12 mb-4 text-green-600" />
                      <h4 className="text-xl font-semibold mb-2">Upload Now</h4>
                      <p className="text-gray-600 mb-4">Upload payment proof immediately</p>
                      <div className="bg-green-50 border border-green-200 rounded p-3 w-full">
                        <p className="text-sm text-green-800">
                          ✓ Order marked as <strong>PAID</strong><br/>
                          ✓ Delivery by: <strong>{calculateDeliveryDate()}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Upload Later */}
                  <div 
                    onClick={() => handleUploadChoice('later')}
                    className="border-2 border-gray-300 rounded-lg p-6 cursor-pointer hover:border-black hover:bg-gray-50 transition-all"
                  >
                    <div className="flex flex-col items-center text-center">
                      <Clock className="w-12 h-12 mb-4 text-orange-600" />
                      <h4 className="text-xl font-semibold mb-2">Upload Later</h4>
                      <p className="text-gray-600 mb-4">Upload within 24 hours</p>
                      <div className="bg-orange-50 border border-orange-200 rounded p-3 w-full">
                        <p className="text-sm text-orange-800">
                          ⚠ Order marked as <strong>UNPAID</strong><br/>
                          ⚠ Must upload by: <strong>{calculateCancellationDate()}</strong><br/>
                          <span className="text-xs">or order will be cancelled</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Now Flow */}
          {showProofUpload && uploadChoice === 'now' && !uploadSuccess && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Payment Proof
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      📦 Your order will be marked as <strong>PAID</strong> and delivered by <strong>{calculateDeliveryDate()}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Payment Proof (Image or PDF)
                    </label>
                    <Input
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
                      className="flex-1"
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
          {showProofUpload && uploadChoice === 'later' && !uploadSuccess && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Order Confirmation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3">⚠ Important Notice</h3>
                    <ul className="space-y-2 text-orange-800">
                      <li>• Your order will be marked as <strong>UNPAID</strong></li>
                      <li>• You have until <strong>{calculateCancellationDate()}</strong> to upload payment proof</li>
                      <li>• Order will be automatically <strong>CANCELLED</strong> if not paid within 24 hours</li>
                      <li>• You can upload proof from your Order History page</li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setUploadChoice(null)}
                      className="flex-1"
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
                  {uploadChoice === 'now' ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <p className="text-green-800 text-lg mb-2">
                        ✓ Payment Status: <strong>PAID</strong>
                      </p>
                      <p className="text-green-800 text-lg">
                        📦 Estimated Delivery: <strong>{calculateDeliveryDate()}</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <p className="text-orange-800 text-lg mb-2">
                        ⚠ Payment Status: <strong>UNPAID</strong>
                      </p>
                      <p className="text-orange-800 text-lg mb-2">
                        ⏰ Upload proof by: <strong>{calculateCancellationDate()}</strong>
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
