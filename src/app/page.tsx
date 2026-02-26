"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, domain, subscribe }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      const params = new URLSearchParams({
        score: String(data.score),
        risk: data.riskLevel,
        domain: data.domain,
        issues: data.issues.join("|"),
        fixes: data.fixes.join("|"),
        missing: (data.missing ?? []).join(","),
      });
      window.location.href = `/results?${params.toString()}`;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200/80 bg-neutral-50/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-display font-semibold tracking-tight text-neutral-900"
          >
            Postman
          </Link>
          <Link href="/blog" className="text-sm text-neutral-600 hover:text-neutral-900">
            Blog
          </Link>
        </div>
      </header>

      <section className="flex-1">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 sm:py-16 lg:py-20">
          {/* Hero: headline + subhead (single column, sets context) */}
          <header className="text-center mb-10 sm:mb-12 lg:mb-14">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-neutral-900 leading-[1.1] tracking-tight max-w-2xl mx-auto">
              Is your email landing where it should?
            </h1>
            <p className="mt-4 sm:mt-5 text-lg sm:text-xl text-neutral-600 max-w-xl mx-auto">
              Instant spam risk check for your email provider or your own domain.
            </p>
          </header>

          {/* Primary row: form and image equal width, image column matches form height */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
            <div className="min-w-0 flex">
              <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 sm:p-8 lg:p-9 w-full">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-neutral-700 mb-1.5"
                    >
                      Your email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50/50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="domain"
                      className="block text-sm font-medium text-neutral-700 mb-1.5"
                    >
                      Custom domain <span className="font-normal text-neutral-500">(optional)</span>
                    </label>
                    <input
                      id="domain"
                      type="text"
                      placeholder="Leave blank to check your email’s provider"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50/50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    />
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subscribe}
                      onChange={(e) => setSubscribe(e.target.checked)}
                      className="mt-1 rounded border-neutral-300 text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-neutral-700">
                      Add me to the email list for tips and updates
                    </span>
                  </label>
                  {error && (
                    <p className="text-sm text-red-600" role="alert">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Checking…" : "Check my email"}
                  </button>
                </form>
              </div>
            </div>
            <div className="min-w-0 flex">
              <div className="w-full overflow-hidden relative flex-1 min-h-[280px] sm:min-h-[320px] lg:min-h-0">
                <Image
                  src="/postman/Artboard 1.png"
                  alt="Postman delivering mail"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-200/80 py-6">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-neutral-500">
          <Link href="/blog" className="hover:text-neutral-700">
            Blog
          </Link>
          <span className="hidden sm:inline">·</span>
          <span>Postman — minimal spam risk check. No database, no sign-up.</span>
        </div>
      </footer>
    </main>
  );
}
