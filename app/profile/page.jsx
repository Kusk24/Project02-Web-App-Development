"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { logout } = useAuth();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ get session via cookie
        const res = await fetch(`${apiUrl}/api/auth/session`, {
          method: "GET",
          credentials: "include", // ensures cookie is sent
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();

        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [apiUrl, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-soft">⏳</div>
          <div className="text-xl font-bold" style={{ color: 'var(--brown-soft)' }}>Loading...</div>
        </div>
      </div>
    );
  }

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
              <div className="flex gap-3">
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
                    <div className="px-4 py-3 rounded-2xl shadow-sm" style={{ backgroundColor: 'var(--cream-warm)', borderLeft: '4px solid var(--coral)' }}>
                      <span className="text-lg font-medium" style={{ color: 'var(--brown-soft)' }}>{user.name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--brown-soft)' }}>
                      <span>📧</span> Email Address
                    </label>
                    <div className="px-4 py-3 rounded-2xl shadow-sm" style={{ backgroundColor: 'var(--cream-warm)', borderLeft: '4px solid var(--mint-vibrant)' }}>
                      <span className="text-lg font-medium" style={{ color: 'var(--brown-soft)' }}>{user.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--brown-soft)' }}>
                      <span>📱</span> Phone Number
                    </label>
                    <div className="px-4 py-3 rounded-2xl shadow-sm" style={{ backgroundColor: 'var(--cream-warm)', borderLeft: '4px solid var(--lavender)' }}>
                      <span className="text-lg font-medium" style={{ color: 'var(--brown-soft)' }}>{user.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--brown-soft)' }}>
                      <span>🏠</span> Address
                    </label>
                    <div className="px-4 py-3 rounded-2xl shadow-sm" style={{ backgroundColor: 'var(--cream-warm)', borderLeft: '4px solid var(--cloud-blue)' }}>
                      <span className="text-lg font-medium" style={{ color: 'var(--brown-soft)' }}>{user.address}</span>
                    </div>
                  </div>

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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}