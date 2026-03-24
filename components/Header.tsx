"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import UserMenu from "@/components/auth/UserMenu";
import LoginModal from "@/components/auth/LoginModal";

export default function Header() {
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
                L
              </div>
              <span className="text-lg font-bold text-primary-900 tracking-tight">
                Launch<span className="text-primary-500">Wise</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/#how-it-works"
                className="text-sm text-text-muted hover:text-primary-600 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/#features"
                className="text-sm text-text-muted hover:text-primary-600 transition-colors"
              >
                Features
              </Link>

              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/start"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                      >
                        Start My Plan
                      </Link>
                      <UserMenu />
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowLogin(true)}
                        className="text-sm text-text-muted hover:text-primary-600 transition-colors font-medium"
                      >
                        Log In
                      </button>
                      <Link
                        href="/start"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                      >
                        Start My Plan
                      </Link>
                    </>
                  )}
                </>
              )}
            </nav>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden pb-4 animate-fade-in">
              <nav className="flex flex-col gap-1">
                <Link
                  href="/#how-it-works"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-text-muted hover:bg-gray-50 transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  href="/#features"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-text-muted hover:bg-gray-50 transition-colors"
                >
                  Features
                </Link>
                {!loading && user && (
                  <Link
                    href="/reports"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm text-text-muted hover:bg-gray-50 transition-colors"
                  >
                    My Reports
                  </Link>
                )}
                {!loading && !user && (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setShowLogin(true);
                    }}
                    className="text-left px-3 py-2 rounded-lg text-sm text-text-muted hover:bg-gray-50 transition-colors font-medium"
                  >
                    Log In
                  </button>
                )}
                <Link
                  href="/start"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 text-center px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold"
                >
                  Start My Plan
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
