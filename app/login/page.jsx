"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Sparkles } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const validateForm = () => {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Email is invalid";
    if (!password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      // Force a reload to ensure auth state is fully loaded
      window.location.href = "/profile";
    } else {
      alert(result.message || "Login failed");
    }
    setLoading(false);
  };

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-soft">✨</div>
          <p style={{ color: 'var(--brown-soft)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is logged in (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--cream)' }}>
      <Header />
      <section className="py-16 flex-grow flex items-center">
        <div className="max-w-md mx-auto w-full px-4">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-float">✨🔐</div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--brown-soft)' }}>
              Welcome Back!
            </h1>
            <p style={{ color: 'var(--gray-light)' }}>Sign in to your account</p>
          </div>

          <Card 
            className="shadow-xl rounded-3xl border-0"
            style={{ backgroundColor: 'white' }}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-center flex items-center justify-center gap-2" style={{ color: 'var(--brown-soft)' }}>
                <LogIn className="w-6 h-6" /> Sign In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--brown-soft)' }}>
                    Email
                  </label>
                  <Input
                    className="rounded-full border-2 focus:ring-2 transition-all"
                    style={{ 
                      borderColor: 'var(--cloud-blue)', 
                      color: 'var(--brown-soft)',
                      backgroundColor: 'var(--cream-warm)'
                    }}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm mt-1" style={{ color: 'var(--coral)' }}>❌ {errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--brown-soft)' }}>
                    Password
                  </label>
                  <Input
                    className="rounded-full border-2 focus:ring-2 transition-all"
                    style={{ 
                      borderColor: 'var(--cloud-blue)', 
                      color: 'var(--brown-soft)',
                      backgroundColor: 'var(--cream-warm)'
                    }}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-sm mt-1" style={{ color: 'var(--coral)' }}>❌ {errors.password}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  style={{ backgroundColor: 'var(--coral)' }}
                >
                  {loading ? "Signing In... ⏳" : "Sign In ✨"}
                </button>
                <div className="text-center text-sm mt-4" style={{ color: 'var(--brown-soft)' }}>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/register")}
                    className="font-bold hover:underline transition-all"
                    style={{ color: 'var(--coral)' }}
                  >
                    Sign Up 💖
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
