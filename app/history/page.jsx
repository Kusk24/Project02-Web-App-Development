"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Calendar, AlertCircle } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HistoryPage() {
  const [orders, setOrders] = useState([]);
  const [uploadingOrderId, setUploadingOrderId] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));

    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, [router]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'paid' 
      ? "bg-green-100 text-green-800 border-green-300" 
      : "bg-orange-100 text-orange-800 border-orange-300";
  };

  const handleFileChange = (e) => {
    setProofFile(e.target.files[0]);
  };

  const handleUploadProof = (orderId) => {
    if (!proofFile) {
      alert('Please select a proof file');
      return;
    }

    // Update order with payment proof
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5);
        return {
          ...order,
          paymentStatus: 'paid',
          paymentProof: proofFile.name,
          deliveryEstimate: deliveryDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          cancellationDeadline: null
        };
      }
      return order;
    });

    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    setUploadingOrderId(null);
    setProofFile(null);
    alert('✓ Payment proof uploaded successfully! Order marked as PAID.');
  };

  const isExpired = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={0} />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Order History</h1>
            <p className="text-xl text-gray-300">
              Track your purchases and upload payment proofs
            </p>
          </div>
        </div>
      </section>

      {/* Orders Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12">
              <div className="text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't made any purchases yet. Start shopping to see your order history here.
                </p>
                <Button onClick={() => router.push("/products")}>
                  Start Shopping
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <p className="text-gray-600">
                          {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus === 'paid' ? '✓ PAID' : '⚠ UNPAID'}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Payment & Delivery Info */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.paymentStatus === 'paid' && order.deliveryEstimate && (
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-green-700" />
                            <p className="text-sm text-green-800">
                              <strong>Delivery Estimate:</strong> {order.deliveryEstimate}
                            </p>
                          </div>
                        </div>
                      )}

                      {order.paymentStatus === 'unpaid' && order.cancellationDeadline && (
                        <div className={`border rounded p-3 ${
                          isExpired(order.cancellationDeadline) 
                            ? 'bg-red-50 border-red-200' 
                            : 'bg-orange-50 border-orange-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            <AlertCircle className={`w-4 h-4 ${
                              isExpired(order.cancellationDeadline) ? 'text-red-700' : 'text-orange-700'
                            }`} />
                            <p className={`text-sm ${
                              isExpired(order.cancellationDeadline) ? 'text-red-800' : 'text-orange-800'
                            }`}>
                              {isExpired(order.cancellationDeadline) ? (
                                <><strong>EXPIRED:</strong> Order cancelled - deadline passed</>
                              ) : (
                                <><strong>Upload by:</strong> {order.cancellationDeadline}</>
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Order Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                          <img
                            src={item.image || "https://via.placeholder.com/80"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg mr-4"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            <p className="font-bold text-black">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Upload Proof Section for Unpaid Orders */}
                    {order.paymentStatus === 'unpaid' && !isExpired(order.cancellationDeadline) && (
                      <div className="border-t pt-6">
                        {uploadingOrderId === order.id ? (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                              <Upload className="w-5 h-5" />
                              Upload Payment Proof
                            </h4>
                            <div className="space-y-4">
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                              />
                              <div className="flex gap-3">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setUploadingOrderId(null);
                                    setProofFile(null);
                                  }}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => handleUploadProof(order.id)}
                                  disabled={!proofFile}
                                  className="flex-1"
                                >
                                  Upload & Mark as Paid
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Button
                            onClick={() => setUploadingOrderId(order.id)}
                            className="w-full md:w-auto"
                            variant="default"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Payment Proof
                          </Button>
                        )}
                      </div>
                    )}

                    {order.paymentStatus === 'unpaid' && isExpired(order.cancellationDeadline) && (
                      <div className="border-t pt-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                          <p className="text-red-800 font-semibold">
                            ❌ This order has been cancelled due to non-payment
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
