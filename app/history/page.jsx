"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "../../context/AuthContext";

export default function HistoryPage() {
  const [orders, setOrders] = useState([]);
  const [proofFile, setProofFile] = useState(null);
  const [uploadingOrderId, setUploadingOrderId] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const res = await fetch(
          `${apiUrl}/api/orders?email=${user.email}`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && !authLoading) {
      fetchOrders();
    }
  }, [user, authLoading, apiUrl]);

  const handleFileChange = (e) => setProofFile(e.target.files[0]);

  const handleUploadProof = async (orderId) => {
    if (!proofFile) {
      alert("Please select a proof file");
      return;
    }

    setUploadingOrderId(orderId);

    try {
      const deliveryEstimate = new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-US");

      const res = await fetch(`${apiUrl}/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: "paid",
          paymentProof: proofFile.name,
          deliveryEstimate,
          cancellationDeadline: null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update order");

      const updatedOrder = await res.json();

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? updatedOrder : order))
      );

      alert("✓ Payment proof uploaded successfully! Order marked as PAID.");
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Failed to upload payment proof");
    } finally {
      setProofFile(null);
      setUploadingOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = confirm("Are you sure you want to cancel this order? This action cannot be undone. 😢");
    if (!confirmed) return;

    setCancellingOrderId(orderId);

    try {
      const res = await fetch(`${apiUrl}/api/orders/${orderId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to cancel order");

      // Remove order from list
      setOrders((prev) => prev.filter((order) => order._id !== orderId));

      alert("✓ Order cancelled successfully!");
    } catch (err) {
      console.error("Cancel error:", err);
      alert("❌ Failed to cancel order");
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-soft">⏳</div>
          <div className="text-xl font-bold" style={{ color: 'var(--brown-soft)' }}>Loading orders...</div>
        </div>
      </div>
    );
  }

  // Show loading state while auth is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-soft">⏳</div>
          <div className="text-xl font-bold" style={{ color: 'var(--brown-soft)' }}>Loading orders...</div>
        </div>
      </div>
    );
  }

  // Don't render if user is not logged in (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--cream)' }}>
      <Header />

      <section 
        className="shadow-lg"
        style={{ 
          background: 'linear-gradient(135deg, var(--mint) 0%, var(--cloud-blue) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4 animate-float">📦✨</div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--brown-soft)' }}>Order History</h1>
          <p className="text-xl" style={{ color: 'var(--brown-soft)' }}>
            Track your purchases and upload payment proofs 💖
          </p>
        </div>
      </section>

      <section className="py-16 flex-grow">
        <div className="max-w-6xl mx-auto px-4">
          {orders.length === 0 ? (
            <div className="rounded-3xl shadow-xl p-12 text-center" style={{ backgroundColor: 'white' }}>
              <div className="text-6xl mb-4">💭</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                No orders found
              </h3>
              <p className="mb-6" style={{ color: 'var(--gray-light)' }}>
                You haven&apos;t made any purchases yet. Start shopping to see
                your order history here! ✨
              </p>
              <button
                onClick={() => router.push("/shop")}
                className="px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 text-white"
                style={{ backgroundColor: 'var(--coral)' }}
              >
                Start Shopping 🛒
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order._id} className="shadow-lg rounded-3xl border-0 overflow-hidden">
                  <CardHeader style={{ backgroundColor: 'var(--cloud-blue-light)' }}>
                    <CardTitle className="flex items-center justify-between flex-wrap gap-2" style={{ color: 'var(--brown-soft)' }}>
                      <span className="flex items-center gap-2">
                        📦 Order #{order._id.slice(-6)}
                      </span>
                      <span
                        className="px-4 py-1 rounded-full text-sm font-bold shadow-sm"
                        style={
                          order.status === "paid"
                            ? { backgroundColor: 'var(--mint-vibrant)', color: 'white' }
                            : { backgroundColor: 'var(--coral)', color: 'white' }
                        }
                      >
                        {order.status === "paid" ? "✅ PAID" : "⏳ UNPAID"}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6" style={{ backgroundColor: 'white' }}>
                    <ul className="mb-4 space-y-2">
                      {order.items.map((item, idx) => (
                        <li 
                          key={idx} 
                          className="flex items-center justify-between p-3 rounded-2xl"
                          style={{ backgroundColor: 'var(--cream-warm)' }}
                        >
                          <span className="font-medium" style={{ color: 'var(--brown-soft)' }}>
                            {item.name} <span className="text-sm" style={{ color: 'var(--gray-light)' }}>(x{item.quantity})</span>
                          </span>
                          <span className="font-bold" style={{ color: 'var(--coral)' }}>${item.price}</span>
                        </li>
                      ))}
                    </ul>
                    {order.paymentProof ? (
                      <div className="p-4 rounded-2xl flex items-center gap-2" style={{ backgroundColor: 'var(--mint)', color: 'var(--brown-soft)' }}>
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Proof uploaded: {order.paymentProof}</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row items-stretch gap-3">
                          <Input
                            type="file"
                            onChange={handleFileChange}
                            className="flex-grow rounded-full border-2"
                            style={{ 
                              borderColor: 'var(--cloud-blue)', 
                              color: 'var(--brown-soft)',
                              backgroundColor: 'var(--cream-warm)'
                            }}
                          />
                          <button
                            onClick={() => handleUploadProof(order._id)}
                            disabled={uploadingOrderId === order._id}
                            className="px-6 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 text-white whitespace-nowrap"
                            style={{ backgroundColor: 'var(--coral)' }}
                          >
                            {uploadingOrderId === order._id
                              ? "Uploading... ⏳"
                              : "Upload Proof 📤"}
                          </button>
                        </div>
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancellingOrderId === order._id}
                            className="px-6 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 text-white"
                            style={{ backgroundColor: '#EF4444' }}
                          >
                            {cancellingOrderId === order._id
                              ? "Cancelling... ⏳"
                              : "❌ Cancel Order"}
                          </button>
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