"use client";
import { useState, useEffect } from "react";
import { Filter, Search, Package, SortAsc } from "lucide-react";
import Header from "../../components/Header";
import ProductCard from "../../components/ProductCard";
import Footer from "../../components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "../../context/CartContext";

export default function ProductsPage() {
  const [clothes, setClothes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [selectedSizes, setSelectedSizes] = useState({});
  const [addedToCart, setAddedToCart] = useState({});
  const { addToCart: addToCartContext } = useCart();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

      try {
        const response = await fetch(`${apiUrl}/api/clothes`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("✅ Fetched products from database:", data.length, "items");
        setClothes(data);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
        alert("Failed to load products from database. Check console for details.");
        setClothes([]);
      }
    };

    fetchProducts();
  }, []);

  // Get unique categories
  const categories = ["All", ...new Set(clothes.map((item) => item.category))];

  // Filter and sort products
  const filteredProducts = clothes
    .filter(
      (item) => selectedCategory === "All" || item.category === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Handle size selection
  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  // Add to cart
  const addToCart = (product) => {
    const selectedSize = selectedSizes[product._id || product.id];

    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }

    const cartItem = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.image,
    };

    addToCartContext(cartItem);

    setAddedToCart((prev) => ({
      ...prev,
      [cartItem.id]: true,
    }));

    setTimeout(() => {
      setAddedToCart((prev) => ({
        ...prev,
        [cartItem.id]: false,
      }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-8 h-8 text-black" />
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          </div>
          <p className="text-lg text-gray-600">
            Discover our complete collection
          </p>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Category Filter */}
            <div className="w-full lg:flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Filter className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">
                  Filter by Category:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    onClick={() => setSelectedCategory(category)}
                    className="cursor-pointer"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="w-full lg:w-auto lg:min-w-[200px]">
              <div className="flex items-center gap-3 mb-3">
                <SortAsc className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">
                  Sort by:
                </span>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full bg-white border border-gray-300 shadow-sm">
                  <SelectValue placeholder="Select sorting option" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-50">
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or check back later for new items.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("All");
                setSortBy("name-asc");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-gray-600 flex items-center gap-2">
                  <span className="font-medium">
                    Showing {filteredProducts.length}
                  </span>
                  <span>of {clothes.length} products</span>
                  {selectedCategory !== "All" && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedCategory}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <SortAsc className="w-4 h-4" />
                  <span>
                    Sorted by:{" "}
                    {sortBy
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id} // ✅ Unique key
                  product={product}
                  onAddToCart={addToCart}
                  onSizeSelect={handleSizeSelect}
                  addedToCart={addedToCart[product._id || product.id]}
                  setAddedToCart={setAddedToCart}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}