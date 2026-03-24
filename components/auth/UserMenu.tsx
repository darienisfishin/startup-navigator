"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const initial = (user.email ?? "U")[0].toUpperCase();
  const shortEmail =
    user.email && user.email.length > 22
      ? user.email.slice(0, 19) + "…"
      : user.email;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors group"
        aria-label="User menu"
      >
        {/* Avatar */}
        <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
          {initial}
        </div>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-xs text-gray-400 mb-0.5">Signed in as</p>
            <p className="text-sm font-medium text-gray-800 truncate">{shortEmail}</p>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            <Link
              href="/reports"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              My Reports
            </Link>

            <button
              onClick={async () => {
                setOpen(false);
                await signOut();
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
