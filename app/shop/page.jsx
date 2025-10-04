"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import ProductCard from "../../components/ProductCard";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";

export default function ShopPage() {
  const [clothes, setClothes] = useState([]);
  const [filteredClothes, setFilteredClothes] = useState([]);
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const { addToCart: addToCartContext } = useCart();

  useEffect(() => {
    fetchClothes();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [clothes, category, sortBy]);

  const fetchClothes = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    try {
      const response = await fetch(`${apiUrl}/api/clothes`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("✅ Fetched clothes from database:", data.length, "items");
      setClothes(data);
      setFilteredClothes(data);
    } catch (error) {
      console.error("❌ Error fetching clothes:", error);
      alert(
        "Failed to load products from database. Check console for details."
      );
      setClothes([]);
      setFilteredClothes([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSort = () => {
    let filtered = [...clothes];

    // Filter by category
    if (category !== "All") {
      filtered = filtered.filter((item) => item.category === category);
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredClothes(filtered);
  };

  const addToCart = (item) => {
    try {
      // Ensure item has an id field (use _id if available)
      const cartItem = {
        ...item,
        id: item.id ?? item._id,
      };
      addToCartContext(cartItem);
      alert("✅ Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ Failed to add item to cart");
    }
  };

  const categories = [
    "All",
    "Tops",
    "Bottoms",
    "Outerwear",
    "Dresses",
    "Shoes",
    "Accessories",
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--cream)' }}>
      <Header />

      {/* Hero Section */}
      <section 
        className="py-12 shadow-lg"
        style={{ 
          background: 'linear-gradient(135deg, var(--cloud-blue) 0%, var(--mint) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4 animate-float">🛍️✨</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--brown-soft)' }}>
            Shop All Products
          </h1>
          <p className="text-xl" style={{ color: 'var(--brown-soft)' }}>
            Browse our complete collection 💖
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="shadow-sm" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--brown-soft)' }}>
                Categories 🏷️
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-5 py-2 rounded-full whitespace-nowrap transition-all font-medium shadow-sm hover:scale-105 ${
                      category === cat ? "shadow-md" : ""
                    }`}
                    style={
                      category === cat
                        ? { backgroundColor: 'var(--coral)', color: 'white' }
                        : { backgroundColor: 'var(--cloud-blue-light)', color: 'var(--brown-soft)' }
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--brown-soft)' }}>
                Sort By ✨
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-auto px-5 py-3 rounded-full focus:outline-none focus:ring-2 font-medium shadow-sm cursor-pointer transition-all hover:shadow-md"
                style={{ 
                  border: '2px solid var(--cloud-blue)',
                  color: 'var(--brown-soft)',
                  backgroundColor: 'var(--cream-warm)',
                  focusRing: 'var(--coral)'
                }}
              >
                <option value="newest">✨ Newest First</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="name-asc">🔤 Name (A–Z)</option>
                <option value="name-desc">🔤 Name (Z–A)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-bounce-soft">⏳</div>
              <p className="text-lg font-medium" style={{ color: 'var(--brown-soft)' }}>Loading products...</p>
            </div>
          ) : filteredClothes.length === 0 ? (
            <div 
              className="text-center py-16 rounded-3xl shadow-lg"
              style={{ backgroundColor: 'white' }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                No products found
              </h3>
              <p style={{ color: 'var(--gray-light)' }}>
                Try adjusting your filters or check back later ✨
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <p 
                  className="text-lg font-medium px-6 py-2 rounded-full inline-block shadow-sm"
                  style={{ backgroundColor: 'var(--lavender)', color: 'var(--brown-soft)' }}
                >
                  Showing {filteredClothes.length} product
                  {filteredClothes.length !== 1 ? "s" : ""} 🎉
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredClothes.map((product, index) => (
                  <ProductCard
                    key={product._id || index}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
