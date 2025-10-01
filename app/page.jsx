"use client";
import { useState, useEffect } from "react";
import { Truck, Shield, Clock, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [clothes, setClothes] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch products
  useEffect(() => {
    fetch("/api/clothes")
      .then((res) => res.json())
      .then(setClothes);
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to cart
  const addToCart = (item) => {
    console.log("Adding to cart:", item.name);
    const existingItem = cart.find(
      (cartItem) => cartItem.id === item.id && cartItem.size === item.size
    );
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id && cartItem.size === item.size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }

    // Show success message
    alert("✅ Item added to cart!");
    console.log("Cart after add:", cart);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />

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
            <Button asChild size="lg" variant="secondary">
              <a href="/products" className="inline-flex items-center gap-2">
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </a>
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
              {clothes.map((product) => (
                <ProductCard
                  key={`${product.id}-${product.size}`}
                  product={product}
                  onAddToCart={addToCart}
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