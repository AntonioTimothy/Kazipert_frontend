"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, XCircle, Mail, Lock } from "lucide-react";

const slides = [
  {
    image: "/worker.jpg",
    title: "Data Security You Can Trust",
    desc: "Kazipert ensures your personal and professional data is encrypted and protected with global-grade security.",
  },
  {
    image: "/worker2.webp",
    title: "Smart Global Recruitment",
    desc: "AI-powered tools help connect Kenyan talent with verified international employers effortlessly.",
  },
  {
    image: "/worker3.webp",
    title: "Seamless Job Applications",
    desc: "A simple, guided process that lets you apply, verify, and track your applications all in one place.",
  },
  {
    image: "/worker4.jpg",
    title: "Empowering Global Employment",
    desc: "Join thousands of users bridging opportunities beyond borders with Kazipert’s trusted platform.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [slide, setSlide] = useState(0);
  const [typedDesc, setTypedDesc] = useState("");

  // Auto-slide every 8s
  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    let active = true;
    const text = slides[slide]?.desc ?? "";
    let index = 0;
    setTypedDesc("");

    const typing = setInterval(() => {
      if (!active) return;
      if (index < text.length) {
        setTypedDesc((prev) => prev + text.charAt(index));
        index++;
      } else clearInterval(typing);
    }, 25);

    return () => {
      active = false;
      clearInterval(typing);
    };
  }, [slide]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Invalid email or password");
      const data = await res.json();

      if (data.role === "employer") router.push("/employer/dashboard");
      else router.push("/employee/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row relative">
      {/* Left section with background slides */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center text-white overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <Image
              src={slides[slide].image}
              alt="Kazipert background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-[#33B1A1]/40 to-[#8B7CF0]/60" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-10 left-10 z-20">
          <Image src="/logo.svg" alt="Kazipert Logo" width={200} height={200} />
        </div>

        <div className="relative z-20 text-center px-12 max-w-lg">
          <motion.h1
            key={slides[slide].title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold leading-snug drop-shadow-lg tracking-tight"
          >
            {slides[slide].title}
          </motion.h1>
          <motion.p
            key={typedDesc}
            className="text-white/90 text-lg mt-6 leading-relaxed min-h-[4rem]"
          >
            {typedDesc}
            <span className="animate-pulse">|</span>
          </motion.p>
        </div>

        <div className="absolute bottom-8 flex space-x-2 z-20">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-6 rounded-full transition-all ${
                i === slide ? "bg-white w-8" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-8 sm:p-12 bg-white relative overflow-hidden">
        {/* Toast Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md z-30"
            >
              <XCircle size={18} />
              <span className="text-sm font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Logo */}
        <div className="flex justify-center mb-8 lg:hidden">
          <Image src="/logo.svg" alt="Kazipert Logo" width={120} height={120} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto w-full space-y-8"
        >
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">
              Welcome back 👋
            </h2>
            <p className="text-gray-500 text-base">
              Sign in to access your Kazipert dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#33B1A1] outline-none transition bg-gray-50 hover:bg-gray-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7CF0] outline-none transition bg-gray-50 hover:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="text-sm text-[#8B7CF0] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#33B1A1] to-[#8B7CF0] text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-all shadow-sm disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </motion.button>

            <div className="text-sm text-center text-gray-600 mt-4">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="text-[#33B1A1] hover:underline font-semibold"
              >
                Sign up
              </button>
            </div>
          </form>

          {loading && (
            <motion.div
              className="mt-6 h-1 bg-gray-100 rounded-full overflow-hidden"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-[#33B1A1] to-[#8B7CF0]"
                animate={{ x: ["0%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
