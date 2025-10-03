"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import ProductCard from "../../components/ProductCard";
import Footer from "../../components/Footer";

export default function ShopPage() {
  const [clothes, setClothes] = useState([]);
  const [filteredClothes, setFilteredClothes] = useState([]);
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

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
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("✅ Fetched clothes from database:", data.length, "items");
      setClothes(data);
      setFilteredClothes(data);
    } catch (error) {
      console.error("❌ Error fetching clothes:", error);
      alert("Failed to load products from database. Check console for details.");
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
      const existingCart = localStorage.getItem("cart");
      const cart = existingCart ? JSON.parse(existingCart) : [];

      const existingItemIndex = cart.findIndex(
        (cartItem) => cartItem._id === item._id && cartItem.size === item.size
      );

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({
          ...item,
          quantity: 1,
          addedAt: new Date().toISOString(),
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop All Products</h1>
          <p className="text-xl text-gray-300">Browse our complete collection</p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    category === cat
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : filteredClothes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or check back later
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <p className="text-gray-600">
                  Showing {filteredClothes.length} product
                  {filteredClothes.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredClothes.map((product, index) => (
                  <ProductCard
                    key={product._id || index} // ✅ Fix duplicate key issue
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