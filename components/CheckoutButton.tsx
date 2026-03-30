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

  async function handleClick() {
    setLoading(true);
    trackPricingClick(tierId);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, reportId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${className ?? ""} disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {loading ? "Redirecting…" : children}
    </button>
  );
}
