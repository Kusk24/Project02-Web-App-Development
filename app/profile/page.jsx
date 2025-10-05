"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Save, X } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };

      // Only include password fields if user wants to change password
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          alert("Please enter your current password to change it");
          setIsSaving(false);
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const res = await fetch(`${apiUrl}/api/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Profile updated successfully! ✨");
        setIsEditing(false);
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
        });
        // Refresh user data
        await refreshUser();
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/users`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account deleted successfully. We're sad to see you go! 💔");
        // Clear auth context and redirect to login
        await logout();
        router.push("/login");
      } else {
        alert(data.error || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-soft">⏳</div>
          <div className="text-xl font-bold" style={{ color: 'var(--brown-soft)' }}>Loading profile...</div>
        </div>
      </div>
    );
  }

  // Only redirect after loading is complete and user is confirmed to be null
  if (!loading && !user) {
    router.push("/login");
    return null;
  }

  // Don't render until user is loaded
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--cream)' }}>
      <Header />

      {/* Profile Header */}
      <section 
        className="shadow-lg"
        style={{ 
          background: 'linear-gradient(135deg, var(--lavender) 0%, var(--cloud-blue) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">👤✨</div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--brown-soft)' }}>My Profile</h1>
            <p className="text-xl" style={{ color: 'var(--brown-soft)' }}>
              Manage your account information 💖
            </p>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-16 flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl shadow-xl overflow-hidden" style={{ backgroundColor: 'white' }}>
            {/* Profile Actions */}
            <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4" style={{ backgroundColor: 'var(--cloud-blue-light)' }}>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--brown-soft)' }}>
                Account Information
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 rounded-full font-bold transition-all hover:scale-105 shadow-md text-white flex items-center gap-2"
                      style={{ backgroundColor: 'var(--lavender)' }}
                    >
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                    <button
                      onClick={() => router.push("/history")}
                      className="px-6 py-2 rounded-full font-bold transition-all hover:scale-105 shadow-md text-white"
                      style={{ backgroundColor: 'var(--mint-vibrant)' }}
                    >
                      📦 Order History
                    </button>
                    <button
                      onClick={logout}
                      className="px-6 py-2 rounded-full font-bold transition-all hover:scale-105 shadow-md text-white"
                      style={{ backgroundColor: '#EF4444' }}
                    >
                      🚪 Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-6 py-2 rounded-full font-bold transition-all hover:scale-105 shadow-md text-white flex items-center gap-2 disabled:opacity-50"
                      style={{ backgroundColor: 'var(--mint-vibrant)' }}
                    >
                      <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          address: user.address || "",
                          currentPassword: "",
                          newPassword: "",
                        });
                      }}
                      className="px-6 py-2 rounded-full font-bold transition-all hover:scale-105 shadow-md flex items-center gap-2"
                      style={{ backgroundColor: 'var(--gray-light)', color: 'white' }}
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--brown-soft)' }}>
                      <span>👤</span> Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="rounded-2xl border-2"
                        style={{ 
                          borderColor: 'var(--coral)', 
                          color: 'var(--brown-soft)',
                          backgroundColor: 'var(--cream-warm)'
                        }}
                      />
                    ) : (
                      <div className="px-4 py-3 rounded-2xl shadow-sm" style={{ backgroundColor: 'var(--cream-warm)', borderLeft: '4px solid var(--coral)' }}>
                        <span className="text-lg font-medium" style={{ color: 'var(--brown-soft)' }}>{user.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--brown-soft)' }}>
                      <span>📧</span> Email Address
                    </label>
                    {isEditing ? (
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="rounded-2xl border-2"
                        style={{ 
                          borderColor: 'var(--mint-vibrant)', 
                          color: 'var(--brown-soft)',
                          backgroundColor: 'var(--cream-warm)'
                        }}
                      />
                    ) : (
                      <div className="px-4 py-3 rounded-2xl shadow-sm" style={{ backgroundColor: 'var(--cream-warm)', borderLeft: '4px solid var(--mint-vibrant)' }}>
                        <span className="text-lg font-medium" style={{ color: 'var(--brown-soft)' }}>{user.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--brown-soft)' }}>
                      <span>📱</span> Phone Number
                    </label>
                    {isEditing ? (
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="rounded-2xl border-2"
                        style={{ 
                          borderColor: 'var(--lavender)', 
                          color: 'var(--brown-soft)',
                          backgroundColor: 'var(--cream-warm)'
                        }}
                      />
                    ) : (
                      <div className="px-4 py-3 rounded-2xl shadow-sm" style={{ backgroundColor: 'var(--cream-warm)', borderLeft: '4px solid var(--lavender)' }}>
                        <span className="text-lg font-medium" style={{ color: 'var(--brown-soft)' }}>{user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--brown-soft)' }}>
                      <span>🏠</span> Address
                    </label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full rounded-2xl border-2 px-4 py-3 focus:outline-none focus:ring-2 transition-all resize-none"
                        style={{ 
                          borderColor: 'var(--cloud-blue)', 
                          color: 'var(--brown-soft)',
                          backgroundColor: 'var(--cream-warm)'
                        }}
                      />
                    ) : (
                      <div className="px-4 py-3 rounded-2xl shadow-sm" style={{ backgroundColor: 'var(--cream-warm)', borderLeft: '4px solid var(--cloud-blue)' }}>
                        <span className="text-lg font-medium" style={{ color: 'var(--brown-soft)' }}>{user.address}</span>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <>
                      <div>
                        <label className="block text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--brown-soft)' }}>
                          <span>🔒</span> Current Password (required to change password)
                        </label>
                        <Input
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Enter current password"
                          className="rounded-2xl border-2"
                          style={{ 
                            borderColor: 'var(--lavender)', 
                            color: 'var(--brown-soft)',
                            backgroundColor: 'var(--cream-warm)'
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--brown-soft)' }}>
                          <span>🔐</span> New Password (leave blank to keep current)
                        </label>
                        <Input
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Enter new password"
                          className="rounded-2xl border-2"
                          style={{ 
                            borderColor: 'var(--coral)', 
                            color: 'var(--brown-soft)',
                            backgroundColor: 'var(--cream-warm)'
                          }}
                        />
                      </div>
                    </>
                  )}

                  {!isEditing && (
                    <>
                      <div>
                        <label className="block text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--brown-soft)' }}>
                          <span>📅</span> Member Since
                        </label>
                        <div className="px-4 py-3 rounded-2xl shadow-sm" style={{ backgroundColor: 'var(--cream-warm)', borderLeft: '4px solid var(--lavender-pink)' }}>
                          <span className="text-lg font-medium" style={{ color: 'var(--brown-soft)' }}>
                            {new Date(user.joinDate || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, var(--coral) 0%, var(--lavender-pink) 100%)' }}>
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-white">
                          <span>⭐</span> Account Status
                        </h3>
                        <p className="text-white font-medium">Active Member</p>
                        <p className="text-sm text-white mt-2 opacity-90">
                          Enjoy free shipping and exclusive offers! 🎁
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Delete Account Section */}
              {!isEditing && (
                <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--gray-light)' }}>
                  <div className="flex flex-col items-center gap-4">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--brown-soft)' }}>
                      Danger Zone ⚠️
                    </h3>
                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-6 py-2 rounded-full font-bold transition-all hover:scale-105 shadow-md"
                        style={{ backgroundColor: '#FCA5A5', color: '#7F1D1D' }}
                      >
                        Delete Account
                      </button>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <p className="text-center font-medium" style={{ color: 'var(--brown-soft)' }}>
                          Are you sure? This action cannot be undone! 😢
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={handleDeleteAccount}
                            className="px-6 py-2 rounded-full font-bold transition-all hover:scale-105 shadow-md text-white"
                            style={{ backgroundColor: '#EF4444' }}
                          >
                            Yes, Delete My Account
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-6 py-2 rounded-full font-bold transition-all hover:scale-105 shadow-md"
                            style={{ backgroundColor: 'var(--gray-light)', color: 'white' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}