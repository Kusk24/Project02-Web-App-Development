"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function MarketplacePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const categories = ["All", "Tops", "Bottoms", "Outerwear", "Dresses", "Shoes", "Accessories"];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        console.log('🛍️  Fetching marketplace listings...');
        const res = await fetch(`${apiUrl}/api/clothes?marketplace=true`, {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log(`📦 Marketplace: Received ${data.length} listings`);
          setListings(data || []);
          setFilteredListings(data || []);
        } else {
          console.error('❌ Failed to fetch marketplace listings:', res.status);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [apiUrl]);

  // Filter and sort listings
  useEffect(() => {
    let filtered = [...listings];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
    }

    setFilteredListings(filtered);
  }, [selectedCategory, sortBy, listings]);

  const handleAddToCart = (item) => {
    // Prevent users from adding their own listings to cart
    if (user && item.user === user._id) {
      alert("❌ You can't buy your own listing!");
      return;
    }

    try {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-soft">⏳</div>
          <p style={{ color: 'var(--brown-soft)' }}>Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--cream)' }}>
      <Header />

      {/* Hero Section */}
      <section 
        className="shadow-lg"
        style={{ 
          background: 'linear-gradient(135deg, var(--mint-vibrant) 0%, var(--cloud-blue) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4 animate-float">🛍️✨</div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'white' }}>
            Buy from Users
          </h1>
          <p className="text-xl text-white">
            Discover unique pre-loved fashion from our community! 💖
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 shadow-sm" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="px-4 py-2 rounded-full font-medium transition-all hover:scale-105 shadow-sm"
                  style={{
                    backgroundColor: selectedCategory === category ? 'var(--coral)' : 'var(--cream-warm)',
                    color: selectedCategory === category ? 'white' : 'var(--brown-soft)',
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: 'var(--brown-soft)' }}>
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-full border-2 focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: 'var(--cloud-blue)', 
                  backgroundColor: 'var(--cream-warm)',
                  color: 'var(--brown-soft)'
                }}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-16 flex-grow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--brown-soft)' }}>
              {filteredListings.length} {filteredListings.length === 1 ? 'Item' : 'Items'} Available
            </h2>
          </div>

          {filteredListings.length === 0 ? (
            <div className="text-center py-16 rounded-3xl shadow-xl" style={{ backgroundColor: 'white' }}>
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                No items found
              </h3>
              <p style={{ color: 'var(--gray-light)' }}>
                Try selecting a different category or check back later! ✨
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((product) => {
                const isOwnListing = user && product.user === user._id;
                
                return (
                  <div key={product._id} className="relative">
                    <ProductCard 
                      product={product} 
                      onAddToCart={handleAddToCart}
                      isOwnListing={isOwnListing}
                      showListedBy={true}
                    />
                    {/* Condition Badge */}
                    {product.condition && (
                      <div 
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium shadow-md z-10"
                        style={{ backgroundColor: 'var(--mint)', color: 'var(--brown-soft)' }}
                      >
                        {product.condition}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
