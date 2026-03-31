"use client";

import { useState } from "react";
import { trackPricingClick } from "@/lib/analytics";

interface Props {
  priceId: string;
  tierId: string;
  reportId?: string;
  children: React.ReactNode;
  className?: string;
}

export default function CheckoutButton({
  priceId,
  tierId,
  reportId,
  children,
  className,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    trackPricingClick(tierId);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, reportId, tierId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`${className ?? ""} disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {loading ? "Redirecting…" : children}
      </button>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
