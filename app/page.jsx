"use client";
import { useState, useEffect } from "react";
import { Truck, Shield, Clock, ArrowRight, Sparkles, Package } from "lucide-react";
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
        id: item.id ?? item._id,
      };
      addToCart(cartItem);
      alert("✨ Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ Failed to add item to cart");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--cream)' }}>
      <Header />

      {/* Hero Section */}
      <section 
        className="shadow-lg"
        style={{ 
          background: 'linear-gradient(135deg, var(--cloud-blue) 0%, var(--lavender-pink) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">☁️👗✨</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--brown-soft)' }}>
              Discover Your Style
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--brown-soft)' }}>
              Premium clothing for every occasion 💖
            </p>
            <Link href="/shop">
              <button 
                className="px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 inline-flex items-center gap-2"
                style={{ backgroundColor: 'var(--coral)', color: 'white' }}
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--brown-soft)' }}>
              Featured Products
            </h2>
            <p className="text-lg" style={{ color: 'var(--brown-soft)' }}>
              Discover our most popular items 🌟
            </p>
          </div>

          {clothes.length === 0 ? (
            <div 
              className="text-center py-16 rounded-3xl shadow-lg"
              style={{ backgroundColor: 'white' }}
            >
              <div className="text-6xl mb-4">�️</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                No products available
              </h3>
              <p style={{ color: 'var(--gray-light)' }}>
                Check back soon for our latest collection! ✨
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              className="text-center p-8 rounded-3xl shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: 'white' }}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                style={{ backgroundColor: 'var(--mint)' }}
              >
                <Truck className="w-10 h-10" style={{ color: 'var(--brown-soft)' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                Free Shipping
              </h3>
              <p style={{ color: 'var(--gray-light)' }}>
                Free shipping on orders over $50 📦
              </p>
            </div>

            <div 
              className="text-center p-8 rounded-3xl shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: 'white' }}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                style={{ backgroundColor: 'var(--coral)' }}
              >
                <Shield className="w-10 h-10" style={{ color: 'white' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                Quality Guarantee
              </h3>
              <p style={{ color: 'var(--gray-light)' }}>
                100% satisfaction guaranteed 💯
              </p>
            </div>

            <div 
              className="text-center p-8 rounded-3xl shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: 'white' }}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                style={{ backgroundColor: 'var(--lavender)' }}
              >
                <Clock className="w-10 h-10" style={{ color: 'var(--brown-soft)' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                Fast Delivery
              </h3>
              <p style={{ color: 'var(--gray-light)' }}>
                Quick and reliable delivery 🚀
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}