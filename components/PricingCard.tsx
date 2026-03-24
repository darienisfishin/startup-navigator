"use client";

import type { PricingTier } from "@/lib/pricing";
import { trackPricingClick } from "@/lib/analytics";

export default function PricingCard({ tier }: { tier: PricingTier }) {
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

      <a
        href={tier.checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackPricingClick(tier.id)}
        className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors ${
          tier.highlighted
            ? "bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-200"
            : "bg-white border border-primary-300 text-primary-700 hover:bg-primary-50"
        }`}
      >
        Get {tier.name} — {tier.price}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );
}
