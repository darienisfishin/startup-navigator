export interface PricingTier {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  tagline: string;
  stripePriceId: string;
  highlighted: boolean;
  features: string[];
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$9.99",
    priceNote: "one-time",
    tagline: "Everything you need to validate your idea.",
    stripePriceId: "price_1TGi2E7KHJcC4hkHP3ztZ68H",
    highlighted: false,
    features: [
      "Full AI-generated startup report",
      "Viability score (0–100)",
      "Competitor snapshot (up to 5)",
      "Local licensing & registration guide",
      "Brand name critique",
      "Step-by-step startup roadmap",
      "90-day action plan",
      "Partner & tool recommendations",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    priceNote: "one-time",
    tagline: "Deeper analysis for serious founders.",
    stripePriceId: "price_1TGi2E7KHJcC4hkHiYp6bXrw",
    highlighted: true,
    features: [
      "Everything in Starter",
      "Extended competitor deep-dive (10+)",
      "Detailed financial assumptions",
      "Go-to-market strategy section",
      "Risk assessment & mitigation plan",
      "Logo & brand identity critique",
      "Priority report generation",
      "Unlimited re-analyses",
    ],
  },
];
