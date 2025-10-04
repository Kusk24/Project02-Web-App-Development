"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Sparkles } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(
      form.name,
      form.email,
      form.password,
      form.phone,
      form.address
    );
    if (result.success) {
      router.push("/profile");
    } else {
      alert(result.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--cream)' }}>
      <Header />
      <section className="py-16 flex-grow flex items-center">
        <div className="max-w-md mx-auto w-full px-4">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-float">🌟👤</div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--brown-soft)' }}>
              Join StyleHub!
            </h1>
            <p style={{ color: 'var(--gray-light)' }}>Create your account and start shopping</p>
          </div>

          <Card 
            className="shadow-xl rounded-3xl border-0"
            style={{ backgroundColor: 'white' }}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-center flex items-center justify-center gap-2" style={{ color: 'var(--brown-soft)' }}>
                <UserPlus className="w-6 h-6" /> Create Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  name="name"
                  placeholder="Full Name ✨"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="rounded-full border-2 focus:ring-2 transition-all"
                  style={{ 
                    borderColor: 'var(--cloud-blue)', 
                    color: 'var(--brown-soft)',
                    backgroundColor: 'var(--cream-warm)'
                  }}
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email 📧"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="rounded-full border-2 focus:ring-2 transition-all"
                  style={{ 
                    borderColor: 'var(--cloud-blue)', 
                    color: 'var(--brown-soft)',
                    backgroundColor: 'var(--cream-warm)'
                  }}
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password 🔒"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="rounded-full border-2 focus:ring-2 transition-all"
                  style={{ 
                    borderColor: 'var(--cloud-blue)', 
                    color: 'var(--brown-soft)',
                    backgroundColor: 'var(--cream-warm)'
                  }}
                />
                <Input
                  name="phone"
                  placeholder="Phone 📱"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="rounded-full border-2 focus:ring-2 transition-all"
                  style={{ 
                    borderColor: 'var(--cloud-blue)', 
                    color: 'var(--brown-soft)',
                    backgroundColor: 'var(--cream-warm)'
                  }}
                />
                <textarea
                  name="address"
                  placeholder="Address 🏠"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full rounded-3xl border-2 px-4 py-3 focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{ 
                    borderColor: 'var(--cloud-blue)', 
                    color: 'var(--brown-soft)',
                    backgroundColor: 'var(--cream-warm)'
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  style={{ backgroundColor: 'var(--mint-vibrant)' }}
                >
                  {loading ? "Creating Account... ⏳" : "Register 🎉"}
                </button>
                <div className="text-center text-sm mt-4" style={{ color: 'var(--brown-soft)' }}>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="font-bold hover:underline transition-all"
                    style={{ color: 'var(--coral)' }}
                  >
                    Sign In 💖
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 rounded-full transition-all hover:scale-105 font-medium"
              style={{ 
                backgroundColor: 'var(--lavender)', 
                color: 'var(--brown-soft)' 
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}