import React from "react";
import { motion } from "framer-motion";
import Logo from "./assets/logo.png";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 antialiased">
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-3">
            <img src={Logo} alt="Vanity Logo" className="h-9 w-auto" />
            <span className="font-semibold text-lg">Vanity</span>
          </a>
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-sky-400">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-sky-400">Pricing</a>
            <a href="#faq" className="text-sm font-medium hover:text-sky-400">FAQ</a>
            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-sky-400">Discord</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm hover:text-sky-400 transition">Login</a>
            <a href="/signup" className="text-sm bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-2xl font-medium transition">Sign Up</a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                One Link. Infinite Possibilities.
              </h1>
              <p className="mt-4 text-lg text-gray-300">
                Vanity helps creators, streamers, and businesses build beautiful, customizable biolink pages. Fast, free, and powerful.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/signup"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-sky-600 text-white font-semibold shadow hover:bg-sky-700"
                >
                  Get Started
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-700 bg-gray-900 text-gray-100 hover:bg-gray-800"
                >
                  Explore Features
                </a>
              </div>
              <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="text-sm">
                  <dt className="text-2xl font-bold">10k+</dt>
                  <dd className="text-gray-400">Users joined</dd>
                </div>
                <div className="text-sm">
                  <dt className="text-2xl font-bold">100%</dt>
                  <dd className="text-gray-400">Free to start</dd>
                </div>
                <div className="text-sm">
                  <dt className="text-2xl font-bold">∞</dt>
                  <dd className="text-gray-400">Unlimited links</dd>
                </div>
                <div className="text-sm">
                  <dt className="text-2xl font-bold">Secure</dt>
                  <dd className="text-gray-400">Firebase-backed</dd>
                </div>
              </dl>
            </motion.div>

            <motion.figure
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="order-first md:order-last"
            >
              <div className="rounded-2xl shadow-xl overflow-hidden border border-gray-800 bg-gray-900">
                <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="h-64 w-full rounded-lg bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">Dashboard preview</span>
                  </div>
                </div>
              </div>
            </motion.figure>
          </div>
          <div className="w-full border-t border-gray-800" />
        </section>

        {/* Features */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-bold">Why Vanity?</h2>
          <p className="mt-2 text-gray-400 max-w-2xl">
            Everything you need to build your perfect biolink — all in one platform.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Custom Themes", body: "Fully personalize your Vanity page with colors, fonts, and animations." },
              { title: "Analytics", body: "Track clicks, countries, and performance — privacy-focused, no cookies." },
              { title: "Unlimited Links", body: "Add as many links, embeds, or videos as you want — no limits." },
              { title: "Fast & Secure", body: "Powered by Firebase for authentication, rate limiting, and stability." },
              { title: "Mobile Optimized", body: "Looks perfect on every device, automatically." },
              { title: "Custom URLs", body: "Get your unique vanity.com/username instantly." },
            ].map((f) => (
              <article key={f.title} className="rounded-2xl border border-gray-800 p-6 bg-gray-900 shadow-sm hover:shadow-sky-900/10 transition">
                <h3 className="font-semibold text-sky-400">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 py-16 border-t border-gray-800">
          <div className="max-w-5xl mx-auto text-center px-6">
            <h2 className="text-3xl font-bold">Claim your Vanity link today</h2>
            <p className="mt-3 text-gray-400">
              Be one of the first to own a personalized vanity.com/username page — it’s fast, free, and takes under a minute.
            </p>
            <div className="mt-6 flex justify-center">
              <a
                href="/signup"
                className="px-6 py-3 rounded-2xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
              >
                Create My Page
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 bg-gray-950/80 backdrop-blur py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Vanity. All rights reserved.
          </div>
          <div className="flex gap-4 items-center">
            <a href="#terms" className="text-sm hover:text-sky-400">Terms</a>
            <a href="#privacy" className="text-sm hover:text-sky-400">Privacy</a>
            <a href="#cookies" className="text-sm hover:text-sky-400">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
