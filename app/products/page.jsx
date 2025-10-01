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

// Sample product data
const products = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    image: "/api/placeholder/400/400",
    rating: 4.5,
    reviews: 128,
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Premium cotton t-shirt with a comfortable fit. Perfect for everyday wear.",
    sale: true,
  },
  {
    id: 2,
    name: "Denim Jacket",
    price: 89.99,
    image: "/api/placeholder/400/400",
    rating: 4.8,
    reviews: 95,
    sizes: ["S", "M", "L", "XL"],
    description:
      "Classic denim jacket with a modern cut. Made from high-quality denim.",
    sale: false,
  },
  {
    id: 3,
    name: "Black Jeans",
    price: 79.99,
    image: "/api/placeholder/400/400",
    rating: 4.3,
    reviews: 210,
    sizes: ["28", "30", "32", "34", "36"],
    description:
      "Slim-fit black jeans with stretch for comfort and style.",
    sale: false,
  },
  {
    id: 4,
    name: "Floral Summer Dress",
    price: 65.99,
    originalPrice: 85.99,
    image: "/api/placeholder/400/400",
    rating: 4.7,
    reviews: 156,
    sizes: ["XS", "S", "M", "L"],
    description: "Light and airy floral dress perfect for summer days.",
    sale: true,
  },
  {
    id: 5,
    name: "Wool Sweater",
    price: 120.0,
    image: "/api/placeholder/400/400",
    rating: 4.6,
    reviews: 89,
    sizes: ["S", "M", "L", "XL"],
    description:
      "Cozy wool sweater for cold weather. Premium merino wool blend.",
    sale: false,
  },
  {
    id: 6,
    name: "Running Shoes",
    price: 149.99,
    image: "/api/placeholder/400/400",
    rating: 4.9,
    reviews: 342,
    sizes: ["7", "8", "9", "10", "11", "12"],
    description: "High-performance running shoes with advanced cushioning.",
    sale: false,
  },
];

export default function ProductsPage() {
  const [clothes, setClothes] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [selectedSizes, setSelectedSizes] = useState({});
  const [addedToCart, setAddedToCart] = useState({});
  const [cartCount, setCartCount] = useState(0);

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

  // Load cart count on component mount
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
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

  // Add to cart - modified to save to localStorage
  const addToCart = (product) => {
    const selectedSize = selectedSizes[product.id];

    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.image,
      quantity: 1,
    };

    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if item with same product and size already exists
    const existingItemIndex = existingCart.findIndex(
      (item) => item.id === product.id && item.size === selectedSize
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item
      existingCart.push(cartItem);
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Update cart count
    const newCartCount = existingCart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    setCartCount(newCartCount);

    // Dispatch event for other components
    window.dispatchEvent(new Event("cartUpdated"));

    // Show success feedback
    setAddedToCart((prev) => ({
      ...prev,
      [product.id]: true,
    }));

    setTimeout(() => {
      setAddedToCart((prev) => ({
        ...prev,
        [product.id]: false,
      }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} />

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

            {/* Sort Options - Fixed with explicit styling */}
            <div className="w-full lg:w-auto lg:min-w-[200px]">
              <div className="flex items-center gap-3 mb-3">
                <SortAsc className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full bg-white border border-gray-300 shadow-sm">
                  <SelectValue placeholder="Select sorting option" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-50">
                  <SelectItem
                    value="name-asc"
                    className="bg-white hover:bg-gray-50 focus:bg-gray-50"
                  >
                    Name (A-Z)
                  </SelectItem>
                  <SelectItem
                    value="name-desc"
                    className="bg-white hover:bg-gray-50 focus:bg-gray-50"
                  >
                    Name (Z-A)
                  </SelectItem>
                  <SelectItem
                    value="price-low"
                    className="bg-white hover:bg-gray-50 focus:bg-gray-50"
                  >
                    Price: Low to High
                  </SelectItem>
                  <SelectItem
                    value="price-high"
                    className="bg-white hover:bg-gray-50 focus:bg-gray-50"
                  >
                    Price: High to Low
                  </SelectItem>
                  <SelectItem
                    value="newest"
                    className="bg-white hover:bg-gray-50 focus:bg-gray-50"
                  >
                    Newest First
                  </SelectItem>
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
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="font-medium">Showing {filteredProducts.length}</span>
                  of {clothes.length} products
                  {selectedCategory !== "All" && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedCategory}
                    </Badge>
                  )}
                </p>
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
                  key={`${product.id}-${product.size}`}
                  product={product}
                  onAddToCart={addToCart}
                  onSizeSelect={handleSizeSelect}
                  addedToCart={addedToCart[product.id]}
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