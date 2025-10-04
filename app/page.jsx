"use client";
import { useState, useEffect } from "react";
import { Truck, Shield, Clock, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Home() {
  const [clothes, setClothes] = useState([]);
  const { addToCart } = useCart();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  // Fetch products
  useEffect(() => {
    fetch(`${apiUrl}/api/clothes`)
      .then((res) => res.json())
      .then(setClothes)
      .catch((error) => console.error("Error fetching clothes:", error));
  }, [apiUrl]);

  // Add to cart handler
  const handleAddToCart = (item) => {
    try {
      // Ensure item has an id field (use _id if available)
      const cartItem = {
        ...item,
        id: item.id || item._id,
      };
      addToCart(cartItem);
      alert("✅ Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ Failed to add item to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Style
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Premium clothing for every occasion
            </p>
            <Button size="lg" variant="secondary">
              <Link href="/shop" className="inline-flex items-center gap-2">
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Discover our most popular items
            </p>
          </div>

          {clothes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👕</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products available
              </h3>
              <p className="text-gray-600">
                Check back soon for our latest collection!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clothes.slice(0, 8).map((product) => (
                <ProductCard
                  key={`${product._id}-${product.name}`}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600">Free shipping on orders over $50</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality Guarantee
              </h3>
              <p className="text-gray-600">100% satisfaction guaranteed</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600">Quick and reliable delivery</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}