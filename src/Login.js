import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://vanitybackend-43ng.onrender.com/auth/loginUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "vanityUser",
          JSON.stringify({
            email: data.email,
            uid: data.uid,
            username: data.email.split("@")[0],
          })
        );
        setMessage("✅ Logged in successfully! Redirecting...");
        setTimeout(() => (window.location.href = "/dashboard"), 1500);
      } else {
        setMessage(`❌ ${data.error || data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center items-center text-center p-10 md:w-1/2"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-sky-400 tracking-wide">
          Vanity
        </h1>
        <p className="max-w-md text-gray-400 text-lg mb-8">
          Welcome back to your Vanity profile. Let’s get you connected again.
        </p>
        <div className="flex space-x-4">
          <span className="px-4 py-2 bg-gray-700 rounded-xl text-sm text-gray-300 border border-gray-600">
            Secure Login
          </span>
          <span className="px-4 py-2 bg-gray-700 rounded-xl text-sm text-gray-300 border border-gray-600">
            Encrypted
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-center w-full md:w-1/2 bg-gray-900/60 p-8"
      >
        <form
          onSubmit={handleLogin}
          className="bg-gray-800/70 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-all duration-300"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
          {message && (
            <p className="mt-4 text-center text-sm text-gray-300">{message}</p>
          )}
          <div className="mt-6 text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <a href="/signup" className="text-sky-400 hover:underline">
              Create one
            </a>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
