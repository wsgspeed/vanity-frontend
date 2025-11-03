import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/auth/registerUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Account created successfully!");
        setEmail("");
        setPassword("");
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
      {}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col justify-center items-center text-center p-10 md:w-1/2"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-sky-400 tracking-wide">
          Vanity
        </h1>
        <p className="max-w-md text-gray-400 text-lg mb-8">
          Build your online identity with confidence. <br />
          Vanity helps you connect, grow, and showcase your digital self -p all in one place.
        </p>
        <div className="flex space-x-4">
          <span className="px-4 py-2 bg-gray-700 rounded-xl text-sm text-gray-300 border border-gray-600">
            Secure
          </span>
          <span className="px-4 py-2 bg-gray-700 rounded-xl text-sm text-gray-300 border border-gray-600">
            Fast
          </span>
          <span className="px-4 py-2 bg-gray-700 rounded-xl text-sm text-gray-300 border border-gray-600">
            Verified
          </span>
        </div>
      </motion.div>

      {}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex items-center justify-center w-full md:w-1/2 bg-gray-900/60 p-8"
      >
        <form
          onSubmit={handleSignup}
          className="bg-gray-800/70 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create your Vanity account
          </h2>

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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          {message && (
            <p className="mt-4 text-center text-sm text-gray-300">{message}</p>
          )}

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-sky-400 hover:underline">
              Sign in
            </a>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
