import { track } from "@vercel/analytics";

export function trackFormStart(): void {
  track("form_start");
}

export function trackFormComplete(): void {
  track("form_complete");
}

export function trackReportGenerated(): void {
  track("report_generated");
}

export function trackPricingClick(tier: string): void {
  track("pricing_click", { tier });
}
