"use client";

import { useState } from "react";
import type { PricingTier } from "@/lib/pricing";
import { trackPricingClick } from "@/lib/analytics";

export default function PricingCard({
  tier,
  reportId,
}: {
  tier: PricingTier;
  reportId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    trackPricingClick(tier.id);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: tier.stripePriceId, reportId }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Failed to start checkout");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-7 h-full transition-shadow hover:shadow-md ${
        tier.highlighted
          ? "border-primary-400 bg-primary-50 shadow-lg shadow-primary-100"
          : "border-border bg-white"
      }`}
    >
      {tier.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-bold tracking-wide">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3
          className={`text-lg font-bold mb-1 ${
            tier.highlighted ? "text-primary-800" : "text-primary-900"
          }`}
        >
          {tier.name}
        </h3>
        <div className="flex items-end gap-1.5 mb-2">
          <span
            className={`text-4xl font-bold tracking-tight ${
              tier.highlighted ? "text-primary-700" : "text-primary-900"
            }`}
          >
            {tier.price}
          </span>
          <span className="text-text-muted text-sm pb-1">{tier.priceNote}</span>
        </div>
        <p className="text-sm text-text-muted">{tier.tagline}</p>
      </div>

      <ul className="space-y-2.5 mb-8 flex-1">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <svg
              className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                tier.highlighted ? "text-primary-500" : "text-green-500"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-text-muted">{feature}</span>
          </li>
        ))}
      </ul>

      {error && (
        <p className="text-xs text-accent-600 mb-3 text-center">{error}</p>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
          tier.highlighted
            ? "bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-200"
            : "bg-white border border-primary-300 text-primary-700 hover:bg-primary-50"
        }`}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            Redirecting…
          </>
        ) : (
          <>
            Get {tier.name} — {tier.price}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
