"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SellPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "Tops",
    sizes: "",
    condition: "Good",
    brand: "",
    image: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const categories = ["Tops", "Bottoms", "Outerwear", "Dresses", "Shoes", "Accessories"];
  const conditions = ["New", "Like New", "Good", "Fair"];

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch user's listings
  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user) return;
      
      setListingsLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/clothes?userId=${user._id}`, {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          setMyListings(data || []);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setListingsLoading(false);
      }
    };

    fetchMyListings();
  }, [user, apiUrl]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare data
      const submitData = {
        ...formData,
        isUserListing: true,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        sizes: formData.sizes.split(',').map(s => s.trim()), // Convert to array
      };

      console.log('📤 Submitting cloth data:', { 
        isUserListing: submitData.isUserListing,
        name: submitData.name,
        sizes: submitData.sizes,
        user_id: user?._id 
      });

      const url = editingId 
        ? `${apiUrl}/api/clothes/${editingId}`
        : `${apiUrl}/api/clothes`;
      
      const method = editingId ? "PATCH" : "POST";
      
      console.log(`📡 Making ${method} request to:`, url);
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(submitData),
      });

      const data = await res.json();
      console.log('📥 Response:', { status: res.status, data });

      if (res.ok) {
        alert(editingId ? "Listing updated! ✨" : "Listing created! 🎉");
        setShowForm(false);
        setEditingId(null);
        setFormData({
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          category: "Tops",
          sizes: "",
          condition: "Good",
          brand: "",
          image: "",
        });
        
        // Refresh listings
        console.log('🔄 Refreshing listings for user:', user._id);
        const refreshRes = await fetch(`${apiUrl}/api/clothes?userId=${user._id}`, {
          credentials: "include",
        });
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          console.log(`✅ Refreshed: Found ${refreshData.length} listings`);
          setMyListings(refreshData || []);
        }
      } else {
        alert(data.message || "Failed to save listing");
      }
    } catch (error) {
      console.error("Error saving listing:", error);
      alert("Failed to save listing");
    }
  };

  const handleEdit = (listing) => {
    setFormData({
      name: listing.name,
      description: listing.description,
      price: listing.price.toString(),
      originalPrice: listing.originalPrice?.toString() || "",
      category: listing.category,
      sizes: Array.isArray(listing.sizes) ? listing.sizes.join(', ') : listing.sizes,
      condition: listing.condition || "Good",
      brand: listing.brand || "",
      image: listing.image,
    });
    setEditingId(listing._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this listing? 😢");
    if (!confirmed) return;

    try {
      const res = await fetch(`${apiUrl}/api/clothes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("Listing deleted successfully! 🗑️");
        setMyListings(myListings.filter(listing => listing._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete listing");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete listing");
    }
  };

  const toggleListingStatus = async (listing) => {
    // For sold items, can only unlist (hide from marketplace)
    let newStatus;
    if (listing.status === 'sold') {
      newStatus = 'unlisted';
    } else {
      newStatus = listing.status === 'active' ? 'unlisted' : 'active';
    }
    
    try {
      const res = await fetch(`${apiUrl}/api/clothes/${listing._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const message = newStatus === 'active' ? "Listing published! 🎉" : 
                       listing.status === 'sold' ? "Sold item unlisted 📦" :
                       "Listing unlisted 📦";
        alert(message);
        setMyListings(myListings.map(l => 
          l._id === listing._id ? { ...l, status: newStatus } : l
        ));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-soft">⏳</div>
          <p className="text-lg font-medium" style={{ color: 'var(--brown-soft)' }}>Loading products...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--cream)' }}>
      <Header />

      {/* Hero Section */}
      <section 
        className="shadow-lg"
        style={{ 
          background: 'linear-gradient(135deg, var(--coral) 0%, var(--lavender-pink) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4 animate-float">👗✨</div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'white' }}>
            Sell Your Clothes
          </h1>
          <p className="text-xl text-white">
            List your items and earn money from your wardrobe! 💰
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 flex-grow">
        <div className="max-w-7xl mx-auto px-4">
          {/* Add New Listing Button */}
          {!showForm && (
            <div className="mb-8 text-center">
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData({
                    name: "",
                    description: "",
                    price: "",
                    originalPrice: "",
                    category: "Tops",
                    sizes: "",
                    condition: "Good",
                    brand: "",
                    image: "",
                  });
                }}
                className="px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 text-white flex items-center gap-2 mx-auto"
                style={{ backgroundColor: 'var(--mint-vibrant)' }}
              >
                <Plus className="w-5 h-5" /> Create New Listing
              </button>
            </div>
          )}

          {/* Listing Form */}
          {showForm && (
            <Card className="shadow-xl rounded-3xl border-0 mb-8">
              <CardHeader style={{ backgroundColor: 'var(--cloud-blue-light)' }}>
                <CardTitle style={{ color: 'var(--brown-soft)' }}>
                  {editingId ? "✏️ Edit Listing" : "➕ New Listing"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6" style={{ backgroundColor: 'white' }}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                        Title *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Vintage Denim Jacket"
                        className="rounded-2xl border-2"
                        style={{ borderColor: 'var(--coral)', backgroundColor: 'var(--cream-warm)' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                        Brand
                      </label>
                      <Input
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="e.g., Levi's"
                        className="rounded-2xl border-2"
                        style={{ borderColor: 'var(--lavender)', backgroundColor: 'var(--cream-warm)' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                        Price * ($)
                      </label>
                      <Input
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        placeholder="29.99"
                        className="rounded-2xl border-2"
                        style={{ borderColor: 'var(--mint-vibrant)', backgroundColor: 'var(--cream-warm)' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                        Original Price ($)
                      </label>
                      <Input
                        name="originalPrice"
                        type="number"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        placeholder="59.99"
                        className="rounded-2xl border-2"
                        style={{ borderColor: 'var(--cloud-blue)', backgroundColor: 'var(--cream-warm)' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-2xl border-2 focus:outline-none focus:ring-2"
                        style={{ borderColor: 'var(--coral)', backgroundColor: 'var(--cream-warm)', color: 'var(--brown-soft)' }}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                        Sizes * (comma-separated: S, M, L)
                      </label>
                      <Input
                        name="sizes"
                        value={formData.sizes}
                        onChange={handleInputChange}
                        required
                        placeholder="S, M, L"
                        className="rounded-2xl border-2"
                        style={{ borderColor: 'var(--lavender)', backgroundColor: 'var(--cream-warm)' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                        Condition *
                      </label>
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-2xl border-2 focus:outline-none focus:ring-2"
                        style={{ borderColor: 'var(--mint-vibrant)', backgroundColor: 'var(--cream-warm)', color: 'var(--brown-soft)' }}
                      >
                        {conditions.map(cond => (
                          <option key={cond} value={cond}>{cond}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                        Image URL
                      </label>
                      <Input
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        className="rounded-2xl border-2"
                        style={{ borderColor: 'var(--cloud-blue)', backgroundColor: 'var(--cream-warm)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      placeholder="Describe your item, its condition, measurements, etc."
                      className="w-full rounded-2xl border-2 px-4 py-3 focus:outline-none focus:ring-2 resize-none"
                      style={{ borderColor: 'var(--coral)', backgroundColor: 'var(--cream-warm)', color: 'var(--brown-soft)' }}
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                      }}
                      className="px-6 py-2 rounded-full font-bold transition-all hover:scale-105"
                      style={{ backgroundColor: 'var(--gray-light)', color: 'white' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-full font-bold transition-all hover:scale-105 text-white shadow-md"
                      style={{ backgroundColor: 'var(--mint-vibrant)' }}
                    >
                      {editingId ? "Update Listing ✨" : "Create Listing 🎉"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* My Listings */}
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--brown-soft)' }}>
              My Listings ({myListings.length})
            </h2>

            {listingsLoading ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 animate-bounce-soft">⏳</div>
                <p className="text-lg font-medium" style={{ color: 'var(--brown-soft)' }}>Loading products...</p>
              </div>
            ) : myListings.length === 0 ? (
              <div className="text-center py-16 rounded-3xl shadow-xl" style={{ backgroundColor: 'white' }}>
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brown-soft)' }}>
                  No listings yet
                </h3>
                <p style={{ color: 'var(--gray-light)' }}>
                  Create your first listing to start selling! ✨
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((listing) => (
                  <Card key={listing._id} className="shadow-lg rounded-3xl border-0 overflow-hidden">
                    <div className="relative">
                      <img
                        src={listing.image}
                        alt={listing.name}
                        className="w-full h-64 object-cover"
                      />
                      {/* Status Badge */}
                      <div
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: 
                            listing.status === 'sold' ? '#EF4444' : 
                            listing.status === 'active' ? 'var(--mint-vibrant)' : 
                            'var(--gray-light)',
                          color: 'white'
                        }}
                      >
                        {listing.status === 'sold' ? '✓ SOLD' : 
                         listing.status === 'active' ? '✓ Active' : 
                         '📦 Unlisted'}
                      </div>
                    </div>
                    <CardContent className="p-4" style={{ backgroundColor: 'white' }}>
                      <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--brown-soft)' }}>
                        {listing.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-xl" style={{ color: 'var(--coral)' }}>
                          ${listing.price}
                        </span>
                        {listing.originalPrice && (
                          <span className="text-sm line-through" style={{ color: 'var(--gray-light)' }}>
                            ${listing.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="mb-3 text-sm" style={{ color: 'var(--gray-light)' }}>
                        <span>{listing.condition}</span>
                      </div>
                      {listing.status === 'sold' && (
                        <div className="mb-3 px-3 py-2 rounded-full text-center font-bold" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                          🎉 This item has been sold!
                        </div>
                      )}
                      <div className="flex gap-2">
                        {/* Sold items: Only Unlist button */}
                        {listing.status === 'sold' && (
                          <button
                            onClick={() => toggleListingStatus(listing)}
                            className="flex-1 px-3 py-2 rounded-full font-bold text-sm transition-all hover:scale-105 text-white"
                            style={{ backgroundColor: 'var(--lavender)' }}
                          >
                            <EyeOff className="w-4 h-4 inline mr-1" />
                            Unlist
                          </button>
                        )}
                        
                        {/* Active/Unlisted items: Toggle and Edit buttons */}
                        {listing.status !== 'sold' && (
                          <>
                            <button
                              onClick={() => toggleListingStatus(listing)}
                              className="flex-1 px-3 py-2 rounded-full font-bold text-sm transition-all hover:scale-105 text-white"
                              style={{ backgroundColor: listing.status === 'active' ? 'var(--lavender)' : 'var(--mint-vibrant)' }}
                            >
                              {listing.status === 'active' ? <EyeOff className="w-4 h-4 inline mr-1" /> : <Eye className="w-4 h-4 inline mr-1" />}
                              {listing.status === 'active' ? 'Unlist' : 'Publish'}
                            </button>
                            <button
                              onClick={() => handleEdit(listing)}
                              className="px-3 py-2 rounded-full font-bold text-sm transition-all hover:scale-105 text-white"
                              style={{ backgroundColor: 'var(--cloud-blue)' }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(listing._id)}
                              className="px-3 py-2 rounded-full font-bold text-sm transition-all hover:scale-105 text-white"
                              style={{ backgroundColor: '#EF4444' }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
