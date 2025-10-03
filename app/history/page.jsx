"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HistoryPage() {
  const [orders, setOrders] = useState([]);
  const [proofFile, setProofFile] = useState(null);
  const [uploadingOrderId, setUploadingOrderId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const sessionRes = await fetch(`${apiUrl}/api/auth/session`, {
          credentials: "include",
        });

        if (!sessionRes.ok) {
          router.push("/login");
          return;
        }

        const sessionData = await sessionRes.json();
        if (!sessionData.authenticated) {
          router.push("/login");
          return;
        }

        setUser(sessionData.user);

        const res = await fetch(
          `${apiUrl}/api/orders?email=${sessionData.user.email}`,
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

    fetchOrders();
  }, [router, apiUrl]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-black">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={0} />

      <section className="bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Order History</h1>
          <p className="text-xl text-gray-300">
            Track your purchases and upload payment proofs
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-black mb-2">
                No orders found
              </h3>
              <p className="text-black mb-6">
                You haven&apos;t made any purchases yet. Start shopping to see
                your order history here.
              </p>
              <Button onClick={() => router.push("/shop")}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order._id}>
                  <CardHeader>
                    <CardTitle className="text-black">
                      Order #{order._id.slice(-6)} –{" "}
                      <span
                        className={
                          order.status === "paid"
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="mb-4 text-black">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="text-black">
                          {item.name} (x{item.quantity}) – ${item.price}
                        </li>
                      ))}
                    </ul>
                    {order.paymentProof ? (
                      <p className="text-green-600">
                        ✅ Proof uploaded: {order.paymentProof}
                      </p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          onChange={handleFileChange}
                          className="text-black"
                        />
                        <Button
                          onClick={() => handleUploadProof(order._id)}
                          disabled={uploadingOrderId === order._id}
                          // no text-black here, keep default button text
                        >
                          {uploadingOrderId === order._id
                            ? "Uploading..."
                            : "Upload Proof"}
                        </Button>
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