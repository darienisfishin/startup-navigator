export interface PricingTier {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  tagline: string;
  checkoutUrl: string;
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
    checkoutUrl:
      "https://launchpilot.buildr.bet/checkout/afc5afd9-6080-4967-a2df-33a2e10219a1",
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
    checkoutUrl:
      "https://launchpilot.buildr.bet/checkout/4adcea4b-dacf-40ac-b04e-051449a9c6cb",
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
